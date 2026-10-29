import {AMBIENT_CHORDS,CHORD_SECONDS,interactionSamples,noteFrequency,reverbSamples,windSamples,type SoundPreferences} from './audio-design';
import {FootstepTracker,type FootstepFrame} from './footsteps';
import {loadFootstepBank,preloadFootsteps,type FootstepBank} from './footstep-bank';

function bufferFrom(context:BaseAudioContext,channels:Float32Array[],sampleRate=22050){
 const buffer=context.createBuffer(channels.length,channels[0].length,sampleRate);
 channels.forEach((samples,index)=>buffer.getChannelData(index).set(samples));return buffer;
}
function fade(parameter:AudioParam,value:number,now:number,seconds=.05){
 parameter.cancelScheduledValues(now);parameter.setTargetAtTime(value,now,seconds);
}

export function createVillageSoundGraph(context:BaseAudioContext){
 const master=context.createGain(),effects=context.createGain(),ambience=context.createGain(),music=context.createGain(),footsteps=context.createGain(),background=context.createGain(),musicInput=context.createGain();
 const limiter=context.createDynamicsCompressor();
 limiter.threshold.value=-6;limiter.knee.value=6;limiter.ratio.value=12;limiter.attack.value=.005;limiter.release.value=.18;
 master.gain.value=0;background.gain.value=0;
 footsteps.connect(effects);effects.connect(master);ambience.connect(background);background.connect(master);master.connect(limiter);limiter.connect(context.destination);

 const musicFilter=context.createBiquadFilter();musicFilter.type='lowpass';musicFilter.frequency.value=2400;
 musicInput.connect(musicFilter);musicFilter.connect(music);music.connect(background);
 const reverb=context.createConvolver(),wet=context.createGain();
 reverb.buffer=bufferFrom(context,reverbSamples(context.sampleRate),context.sampleRate);wet.gain.value=.48;
 music.connect(reverb);reverb.connect(wet);wet.connect(background);

 const wind=context.createBufferSource();wind.buffer=bufferFrom(context,windSamples());wind.loop=true;
 const high=context.createBiquadFilter(),low=context.createBiquadFilter(),windGain=context.createGain();
 high.type='highpass';high.frequency.value=100;low.type='lowpass';low.frequency.value=650;low.Q.value=.4;windGain.gain.value=.25;
 wind.connect(high);high.connect(low);low.connect(windGain);windGain.connect(ambience);
 const rustle=context.createBiquadFilter(),leafGain=context.createGain();
 rustle.type='bandpass';rustle.frequency.value=2300;rustle.Q.value=.6;leafGain.gain.value=.14;
 wind.connect(rustle);rustle.connect(leafGain);leafGain.connect(ambience);
 const swell=context.createOscillator(),swellDepth=context.createGain(),flutter=context.createOscillator(),flutterDepth=context.createGain();
 swell.frequency.value=.043;swellDepth.gain.value=.11;swell.connect(swellDepth);swellDepth.connect(windGain.gain);
 flutter.frequency.value=.19;flutterDepth.gain.value=.115;flutter.connect(flutterDepth);flutterDepth.connect(leafGain.gain);
 wind.start();swell.start();flutter.start();

 const interaction=bufferFrom(context,[interactionSamples()]);
 return {master,effects,ambience,music,footsteps,background,musicInput,interaction,
  dispose:()=>{for(const source of [wind,swell,flutter]){try{source.stop();}catch{}}master.disconnect();},
 };
}
type SoundGraph=ReturnType<typeof createVillageSoundGraph>;

export function playSoundBuffer(context:BaseAudioContext,destination:AudioNode,buffer:AudioBuffer,when=context.currentTime,gain=.7,pan=0,rate=1){
 const source=context.createBufferSource(),level=context.createGain(),stereo=context.createStereoPanner();
 source.buffer=buffer;source.playbackRate.value=rate;level.gain.value=gain;stereo.pan.value=pan;
 source.connect(level);level.connect(stereo);stereo.connect(destination);
 source.onended=()=>{source.disconnect();level.disconnect();stereo.disconnect();};source.start(when);
 return {source,stop:()=>{const now=context.currentTime;fade(level.gain,0,now,.006);try{source.stop(now+.025);}catch{}}};
}

/** Warm sustained fifths and a few soft celesta-like notes, on the audio clock. */
export function scheduleAmbientChord(context:BaseAudioContext,destination:AudioNode,index:number,start:number){
 const chord=AMBIENT_CHORDS[index%AMBIENT_CHORDS.length];
 chord.forEach((note,i)=>{
  const envelope=context.createGain(),pan=context.createStereoPanner();pan.pan.value=-.45+i*.18;
  const amplitude=i===0 ? .025 : .015;
  envelope.gain.setValueAtTime(0,start);envelope.gain.linearRampToValueAtTime(amplitude,start+3.2);
  envelope.gain.setValueAtTime(amplitude,start+10.5);envelope.gain.linearRampToValueAtTime(0,start+16);
  envelope.connect(pan);pan.connect(destination);
  let remaining=2;
  for(const side of [-1,1]){
   const oscillator=context.createOscillator();oscillator.type=side<0?'sine':'triangle';oscillator.frequency.value=noteFrequency(note);oscillator.detune.value=side*3;
   oscillator.connect(envelope);oscillator.onended=()=>{oscillator.disconnect();if(--remaining===0){envelope.disconnect();pan.disconnect();}};
   oscillator.start(start);oscillator.stop(start+16.05);
  }
 });
 for(const [i,offset] of [5.5,9.2].entries()){
  const note=chord[i===0?4:3]+12,when=start+offset,envelope=context.createGain(),pan=context.createStereoPanner();
  pan.pan.value=i===0?-.3:.3;envelope.gain.setValueAtTime(0,when);envelope.gain.linearRampToValueAtTime(.024,when+.035);envelope.gain.exponentialRampToValueAtTime(.0001,when+2.7);
  envelope.connect(pan);pan.connect(destination);
  const oscillator=context.createOscillator();oscillator.type='sine';oscillator.frequency.value=noteFrequency(note);oscillator.connect(envelope);
  oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();pan.disconnect();};oscillator.start(when);oscillator.stop(when+2.8);
 }
}

export class VillageAudio{
 private context:AudioContext|null=null;
 private graph:SoundGraph|null=null;
 private preferences:SoundPreferences;
 private tracker=new FootstepTracker();
 private scene:'welcome'|'play'|'menu'='welcome';
 private visible=true;
 private failed=false;
 private scheduler:number|null=null;
 private suspendTimer:number|null=null;
 private nextChord=0;
 private chordIndex=0;
 private steps=0;
 private interactions=0;
 private feet=new Set<ReturnType<typeof playSoundBuffer>>();
 private cues=new Set<ReturnType<typeof playSoundBuffer>>();
 private stepBuffers:FootstepBank={};
 constructor(preferences:SoundPreferences){this.preferences={...preferences};void preloadFootsteps();}
 get state(){return this.failed?'unavailable':this.context?.state??'idle';}
 get stepCount(){return this.steps;}
 get interactionCount(){return this.interactions;}
 get footstepBanks(){return Object.keys(this.stepBuffers).length;}
 private audible(){const p=this.preferences;return this.visible&&this.scene!=='welcome'&&!p.muted&&p.master>0&&(p.effects>0||p.ambience>0||p.music>0);}
 private levels(){
  const c=this.context,g=this.graph;if(!c||!g)return;const p=this.preferences,now=c.currentTime;
  fade(g.master.gain,this.audible()?p.master:0,now,.04);fade(g.effects.gain,p.effects,now);
  fade(g.ambience.gain,p.ambience,now,.3);fade(g.music.gain,p.music,now,.5);
  fade(g.background.gain,this.scene==='play' ? 1 : this.scene==='menu' ? .32 : 0,now,.55);
  fade(g.footsteps.gain,this.scene==='play'?1:0,now,.015);
 }
 private schedule(){
  const c=this.context,g=this.graph;if(!c||!g||c.state!=='running'||this.preferences.music===0)return;
  if(this.nextChord<c.currentTime-.2)this.nextChord=c.currentTime+.05;
  if(this.nextChord<c.currentTime+1.5){scheduleAmbientChord(c,g.musicInput,this.chordIndex++,this.nextChord);this.nextChord+=CHORD_SECONDS;}
 }
 private sleepIfSilent(){
  if(this.suspendTimer!==null)window.clearTimeout(this.suspendTimer);
  this.suspendTimer=null;if(this.audible())return;
  this.suspendTimer=window.setTimeout(()=>{this.suspendTimer=null;if(!this.audible())void this.context?.suspend().catch(()=>{});},180);
 }
 /** Only called from existing user gestures; audio never blocks entering the game. */
 unlock(){
  if(this.failed||!this.audible())return;
  if(this.suspendTimer!==null){window.clearTimeout(this.suspendTimer);this.suspendTimer=null;}
  try{
   if(!this.context){
    const c=new AudioContext();this.context=c;this.graph=createVillageSoundGraph(c);this.nextChord=c.currentTime+.05;
    void loadFootstepBank(c).then(bank=>{if(this.context===c)this.stepBuffers=bank;}).catch(()=>{});
    this.scheduler=window.setInterval(()=>this.schedule(),700);
   }
   this.levels();const current=this.context;
   if(current.state==='suspended')void current.resume().then(()=>{if(this.context===current&&this.audible())this.schedule();else this.sleepIfSilent();}).catch(()=>{});
   else this.schedule();
  }catch{this.dispose();this.failed=true;}
 }
 setScene(scene:'welcome'|'play'|'menu'){
  this.scene=scene;if(scene!=='play'){this.tracker.reset();this.stopFeet();}if(scene==='welcome')this.stopCues();
  this.levels();this.sleepIfSilent();
 }
 configure(preferences:SoundPreferences){this.preferences={...preferences};if(preferences.muted||preferences.effects===0||preferences.master===0){this.stopFeet();this.stopCues();}this.levels();this.sleepIfSilent();}
 setVisible(visible:boolean){this.visible=visible;if(!visible){this.tracker.reset();this.stopFeet();this.stopCues();}this.levels();if(visible&&this.context)this.unlock();else this.sleepIfSilent();}
 step(frame:FootstepFrame){
  const step=this.tracker.update({...frame,active:frame.active&&this.scene==='play'}),c=this.context,g=this.graph;
  if(!step||!c||!g||c.state!=='running'||!this.audible()||this.preferences.effects===0)return;
  const buffers=this.stepBuffers[step.surface]??this.stepBuffers.earth;
  if(!buffers?.length)return; // Never queue late impacts while recordings load.
  const variation=this.steps%4,buffer=buffers[(this.steps*5+Math.floor(this.steps/buffers.length))%buffers.length];
  const voice=playSoundBuffer(c,g.footsteps,buffer,c.currentTime,(step.running ? .67 : .52)*[1,.96,1.03,.98][variation],step.pan,[1,.985,1.015,.995][variation]);
  this.feet.add(voice);voice.source.addEventListener('ended',()=>this.feet.delete(voice),{once:true});this.steps++;
 }
 interact(){
  this.unlock();const c=this.context,g=this.graph;
  if(!c||!g||!this.audible()||this.preferences.effects===0)return;
  const play=()=>{if(this.context!==c||!this.audible()||this.preferences.effects===0)return;const voice=playSoundBuffer(c,g.effects,g.interaction,c.currentTime,.78);this.cues.add(voice);voice.source.addEventListener('ended',()=>this.cues.delete(voice),{once:true});this.interactions++;};
  if(c.state==='running')play();else void c.resume().then(play).catch(()=>{});
 }
 private stopFeet(){for(const voice of this.feet)voice.stop();this.feet.clear();}
 private stopCues(){for(const voice of this.cues)voice.stop();this.cues.clear();}
 resetSteps(){this.tracker.reset();this.stopFeet();}
 dispose(){
  if(this.scheduler!==null)window.clearInterval(this.scheduler);if(this.suspendTimer!==null)window.clearTimeout(this.suspendTimer);
  this.scheduler=null;this.suspendTimer=null;this.stopFeet();this.stopCues();this.graph?.dispose();this.graph=null;
  this.stepBuffers={};
  const old=this.context;this.context=null;if(old&&old.state!=='closed')void old.close().catch(()=>{});
 }
}
