import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DEFAULT_SOUND,decodeSound,interactionSamples,windSamples,reverbSamples,AMBIENT_CHORDS,noteFrequency} from '../src/audio-design.ts';
import {FootstepTracker,footstepSurfaceAt,FOOT_CONTACTS,type FootstepFrame} from '../src/footsteps.ts';
import {travelerGait} from './traveler-gait.mjs';
import {buildings,localPoint} from '../src/village.ts';

assert.deepEqual(decodeSound(null),DEFAULT_SOUND);
assert.deepEqual(decodeSound('{broken'),DEFAULT_SOUND);
assert.deepEqual(decodeSound('{"version":2,"muted":true}'),DEFAULT_SOUND);
const preferences=decodeSound('{"version":1,"muted":true,"master":0,"effects":3,"music":-1,"ambience":"loud"}');
assert.deepEqual(preferences,{muted:true,master:0,effects:1,music:0,ambience:DEFAULT_SOUND.ambience});
assert.deepEqual(decodeSound(JSON.stringify({version:1,...preferences})),preferences,'Mute and zero volume survive a reload');
assert.equal(footstepSurfaceAt(4,28),'earth');assert.equal(footstepSurfaceAt(0,4),'earth');assert.equal(footstepSurfaceAt(-27,27),'grass');
for(const building of buildings)assert.equal(footstepSurfaceAt(...localPoint(building,0,1)),'wood',`${building.id} uses its rotated wooden floor`);

for(const clip of ['Walk','Run'] as const){
 const gait=travelerGait(clip);
 for(const contact of FOOT_CONTACTS[clip]){
  const side=contact.pan<0?'left':'right';
  gait.mixer.setTime(gait.clip.duration*((contact.phase-.04+1)%1));const before=gait.footPosition(side);
  gait.mixer.setTime(gait.clip.duration*contact.phase);const at=gait.footPosition(side);
  assert.ok(at.y<.1&&at.y<=before.y+.001&&at.z>0,`${clip} ${side} contact matches the real GLB's descending, forward, grounded foot`);
 }
}
function journey(clip:'Walk'|'Run',fps:number,scale:number,blocked=false){
 const gait=travelerGait(clip),tracker=new FootstepTracker();gait.action.timeScale=scale;let count=0;
 tracker.update({x:4,z:28,delta:1/fps,active:true,clip,time:0,duration:gait.clip.duration});
 for(let i=1;i<=fps*6;i++){
  gait.mixer.update(1/fps);
  const hit=tracker.update({x:4,z:28-(blocked?0:i*(clip==='Run'?5:2.9)/fps),delta:1/fps,active:true,clip,time:gait.action.time,duration:gait.clip.duration});
  if(hit){count++;const phase=gait.action.time/gait.clip.duration;
   assert.ok(FOOT_CONTACTS[clip].some(c=>(phase-c.phase+1)%1<=scale/fps/gait.clip.duration+.00001),'Every sound falls within one rendered frame of a contact');
  }
 }
 return count;
}
const walking=journey('Walk',60,3.2),running=journey('Run',60,3.4);
assert.ok(Math.abs(walking-36)<=1&&Math.abs(running-51)<=1,'Two impacts per complete animation stride');
for(const fps of [30,90,144]){assert.ok(Math.abs(journey('Walk',fps,3.2)-walking)<=1);assert.ok(Math.abs(journey('Run',fps,3.4)-running)<=1);}
assert.ok(journey('Walk',60,1.6)<walking*.6,'Cadence follows animation speed, not an independent distance timer');
assert.equal(journey('Run',60,3.4,true),0,'Animation can continue against a wall without impacts');
const tracker=new FootstepTracker();
const frame:FootstepFrame={x:4,z:28,delta:.016,active:true,clip:'Walk',time:.48,duration:1};
tracker.update(frame);
assert.equal(tracker.update({...frame,x:24,time:.51}),null,'Teleport cannot emit a burst');
assert.equal(tracker.update({...frame,x:24.05,time:.99,active:false}),null,'Menus suppress footsteps');
assert.equal(tracker.update({...frame,x:24.1,time:.01}),null,'Resume cannot replay missed contacts');
assert.equal(tracker.update({...frame,x:24.2,time:.03,clip:'Run'}),null,'Changing gait cannot replay the previous gait contacts');
tracker.reset();assert.equal(tracker.update(frame),null);

function levels(samples:Float32Array){let energy=0,peak=0;for(const value of samples){assert.ok(Number.isFinite(value));energy+=value*value;peak=Math.max(peak,Math.abs(value));}return {rms:Math.sqrt(energy/samples.length),peak};}
const assets=JSON.parse(readFileSync(new URL('../src/footstep-assets.json',import.meta.url),'utf8'));
const receipt=JSON.parse(readFileSync(new URL('../public/audio/footsteps/receipt.json',import.meta.url),'utf8'));
let audioBytes=0;
for(const surface of ['earth','grass','wood']){
 const asset=assets[surface],bytes=readFileSync(new URL('../public'+asset.file,import.meta.url));audioBytes+=bytes.length;
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.readUInt32LE(24),22050);assert.equal(bytes.readUInt16LE(22),1);assert.equal(bytes.readUInt16LE(34),16);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),receipt.sources.find((s:{surface:string})=>s.surface===surface).outputSha256,'Recording bytes match provenance receipt');
 assert.ok(asset.clips.length>=(surface==='grass'?1:7),'Use separate natural recorded takes');
 for(const region of asset.clips){
  const samples=Float32Array.from({length:region.length},(_,i)=>bytes.readInt16LE(44+(region.offset+i)*2)/32768),level=levels(samples);
  assert.ok(samples.length/22050>.1&&samples.length/22050<.35,'One impact per clip, without a baked-in walking rhythm');
  assert.ok(level.rms>.025&&level.rms<.09&&level.peak<.61);assert.equal(Math.abs(samples[0]),0);assert.equal(Math.abs(samples.at(-1)!),0);
 }
}
assert.ok(audioBytes<180000,'Keep all recorded footsteps under 180 KB');
const interaction=interactionSamples(),interactionLevel=levels(interaction);assert.ok(interactionLevel.rms>.01&&interactionLevel.peak<.49);assert.equal(Math.abs(interaction[0]),0);assert.equal(Math.abs(interaction.at(-1)!),0);
const wind=windSamples();assert.equal(wind[0].length,16*22050);assert.notDeepEqual(wind[0],wind[1],'Wind is stereo');
for(const channel of wind){const level=levels(channel);assert.ok(level.rms>.02&&level.peak<1);assert.ok(Math.abs(channel[0]-channel.at(-1)!)<.4,'Loop boundary has no artificial spike');}
for(const channel of reverbSamples(22050))assert.ok(levels(channel.subarray(channel.length-100)).peak<.01,'Reverb has a quiet tail');
for(const chord of AMBIENT_CHORDS)for(const note of chord)assert.ok(noteFrequency(note)>20&&noteFrequency(note)<5000);
console.log(`PASS: real GLB foot contacts at 30–144 FPS (walk ${walking}, run ${running}), speed changes, walls/pause/teleports/reset, 16 trimmed recorded impacts (${audioBytes} bytes), source receipts, saved sound preferences, unchanged interaction/wind/music.`);
