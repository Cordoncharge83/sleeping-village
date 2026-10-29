import assert from 'node:assert/strict';
import {DEFAULT_SOUND,decodeSound,footstepSamples,interactionSamples,windSamples,reverbSamples,AMBIENT_CHORDS,noteFrequency} from '../src/audio-design.ts';
import {FootstepTracker,footstepSurfaceAt} from '../src/footsteps.ts';
import {buildings,localPoint} from '../src/village.ts';

assert.deepEqual(decodeSound(null),DEFAULT_SOUND);
assert.deepEqual(decodeSound('{broken'),DEFAULT_SOUND);
assert.deepEqual(decodeSound('{"version":2,"muted":true}'),DEFAULT_SOUND);
const preferences=decodeSound('{"version":1,"muted":true,"master":0,"effects":3,"music":-1,"ambience":"loud"}');
assert.deepEqual(preferences,{muted:true,master:0,effects:1,music:0,ambience:DEFAULT_SOUND.ambience});
assert.deepEqual(decodeSound(JSON.stringify({version:1,...preferences})),preferences,'Mute and zero volume survive a reload');
assert.equal(footstepSurfaceAt(4,28),'earth');assert.equal(footstepSurfaceAt(0,4),'earth');assert.equal(footstepSurfaceAt(-27,27),'grass');
for(const building of buildings)assert.equal(footstepSurfaceAt(...localPoint(building,0,1)),'wood',`${building.id} uses its rotated wooden floor`);

function journey(running:boolean,fps:number){
 const tracker=new FootstepTracker();let count=0;tracker.update(4,28,1/fps,true,running);
 for(let i=1;i<=fps*6;i++)if(tracker.update(4,28-i*(running?5:2.9)/fps,1/fps,true,running))count++;
 return count;
}
const walking=journey(false,60),running=journey(true,60);assert.ok(running>walking+3,'Running produces a faster cadence');
for(const fps of [30,90,144]){assert.ok(Math.abs(journey(false,fps)-walking)<=1);assert.ok(Math.abs(journey(true,fps)-running)<=1);}
const tracker=new FootstepTracker();tracker.update(4,28,.016,true,false);
for(let i=0;i<300;i++)assert.equal(tracker.update(4,28,.016,true,true),null,'Holding movement against a wall stays quiet');
assert.equal(tracker.update(24,0,.016,true,false),null,'Teleporting cannot emit a burst');
assert.equal(tracker.update(24.05,0,.016,false,false),null,'Menus suppress footsteps');
assert.equal(tracker.update(24.05,0,.016,true,false),null,'Resume cannot replay a missed step');
assert.equal(tracker.update(24.25,0,.016,true,false)?.running,false);
tracker.reset();assert.equal(tracker.update(4,28,.016,true,false),null);

function levels(samples:Float32Array){let energy=0,peak=0;for(const value of samples){assert.ok(Number.isFinite(value));energy+=value*value;peak=Math.max(peak,Math.abs(value));}return {rms:Math.sqrt(energy/samples.length),peak};}
const signatures:number[]=[];
for(const surface of ['earth','grass','wood'] as const){
 const samples=footstepSamples(surface,739),level=levels(samples);signatures.push(samples[120]);
 assert.ok(level.rms>.01&&level.rms<.3);assert.ok(level.peak<.56);assert.equal(Math.abs(samples[0]),0);assert.equal(Math.abs(samples.at(-1)!),0);
 assert.notDeepEqual(samples,footstepSamples(surface,941),'Consecutive impacts vary');
}
assert.equal(new Set(signatures).size,3,'Ground textures produce distinct sounds');
const interaction=interactionSamples(),interactionLevel=levels(interaction);assert.ok(interactionLevel.rms>.01&&interactionLevel.peak<.49);assert.equal(Math.abs(interaction[0]),0);assert.equal(Math.abs(interaction.at(-1)!),0);
const wind=windSamples();assert.equal(wind[0].length,16*22050);assert.notDeepEqual(wind[0],wind[1],'Wind is stereo');
for(const channel of wind){const level=levels(channel);assert.ok(level.rms>.02&&level.peak<1);assert.ok(Math.abs(channel[0]-channel.at(-1)!)<.4,'Loop boundary has no artificial spike');}
for(const channel of reverbSamples(22050))assert.ok(levels(channel.subarray(channel.length-100)).peak<.01,'Reverb has a quiet tail');
for(const chord of AMBIENT_CHORDS)for(const note of chord)assert.ok(noteFrequency(note)>20&&noteFrequency(note)<5000);
console.log(`PASS: saved sound preferences, rotated floor materials, distance-based steps at 30–144 FPS (walk ${walking}, run ${running}), idle/walls/pause/reset, varied click-free effects, stereo wind and quiet reverb tails.`);
