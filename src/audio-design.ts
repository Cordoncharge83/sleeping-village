export type GroundSound='earth'|'grass'|'wood';
export type SoundPreferences={muted:boolean;master:number;effects:number;ambience:number;music:number};
export const SOUND_KEY='sleeping-village.sound.v1';
export const DEFAULT_SOUND:SoundPreferences={muted:false,master:.7,effects:.7,ambience:.45,music:.1};

export function decodeSound(raw:string|null):SoundPreferences{
 try{
  const data=JSON.parse(raw??'null');if(data?.version!==1)return {...DEFAULT_SOUND};
  const result={...DEFAULT_SOUND,muted:typeof data.muted==='boolean'?data.muted:false};
  for(const key of ['master','effects','ambience','music'] as const){const value=data[key];if(typeof value==='number'&&Number.isFinite(value))result[key]=Math.min(1,Math.max(0,value));}
  return result;
 }catch{return {...DEFAULT_SOUND};}
}
export function randomSequence(seed:number){let state=seed>>>0;return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};}
function finish(samples:Float32Array,peak:number){
 let maximum=0;for(const sample of samples)maximum=Math.max(maximum,Math.abs(sample));
 const scale=maximum?peak/maximum:0;
 for(let i=0;i<samples.length;i++)samples[i]*=scale*Math.min(1,i/30,(samples.length-1-i)/90);
 return samples;
}

/** A papery opening sound followed by a small, warm magical chime. */
export function interactionSamples(sampleRate=22050){
 const samples=new Float32Array(Math.ceil(sampleRate*.65)),random=randomSequence(319);let smooth=0;
 for(let i=0;i<samples.length;i++){
  const t=i/sampleRate,n=random()*2-1;smooth+=(n-smooth)*.2;
  let value=smooth*.7*Math.exp(-t/.045)*Math.min(1,t/.004);
  for(const [frequency,delay,strength] of [[587.33,.018,.25],[880,.065,.16],[1174.66,.11,.1]]){
   const age=t-delay;if(age>0)value+=strength*(Math.sin(2*Math.PI*frequency*age)+.2*Math.sin(2*Math.PI*frequency*2.01*age))*Math.exp(-age/.15)*Math.min(1,age/.006);
  }
  samples[i]=value;
 }
 return finish(samples,.48);
}

/** Crossfaded stereo pink/white noise, without a silent dip at the loop seam. */
export function windSamples(sampleRate=22050,seconds=16):[Float32Array,Float32Array]{
 const count=Math.ceil(sampleRate*seconds),fade=Math.ceil(sampleRate*.7);
 return [0,1].map(channel=>{
  const random=randomSequence(928+channel*731),source=new Float32Array(count+fade);let low=0;
  for(let i=0;i<source.length;i++){const white=random()*2-1;low=.985*low+.015*white;source[i]=low*2.6+white*.12;}
  for(let i=0;i<fade;i++){const blend=i/(fade-1);source[count+i]=source[count+i]*(1-blend)+source[i]*blend;}
  return source.slice(fade);
 }) as [Float32Array,Float32Array];
}

export function reverbSamples(sampleRate:number):[Float32Array,Float32Array]{
 return [0,1].map(channel=>{
  const random=randomSequence(1623+channel*991),samples=new Float32Array(Math.ceil(sampleRate*2.8));let smooth=0;
  for(let i=0;i<samples.length;i++){const t=i/sampleRate;smooth+=(random()*2-1-smooth)*.45;samples[i]=smooth*Math.exp(-t/0.55)*(1-Math.exp(-t/.012));}
  return samples;
 }) as [Float32Array,Float32Array];
}

// Original slow, open-voiced fantasy progression; no borrowed recording or melody.
export const CHORD_SECONDS=12;
export const AMBIENT_CHORDS=[
 [50,57,62,65,69,76], [46,53,58,62,65,69],
 [41,53,57,60,64,67], [48,55,60,62,67,74],
 [43,55,58,62,65,69], [46,53,58,62,65,72],
 [45,52,57,60,64,71], [50,57,62,65,69,76],
] as const;
export const noteFrequency=(midi:number)=>440*Math.pow(2,(midi-69)/12);
