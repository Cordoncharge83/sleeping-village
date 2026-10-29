import assets from './footstep-assets.json';
import type {GroundSound} from './audio-design';
import {publicAssetUrl} from './public-asset';

export type FootstepBank=Partial<Record<GroundSound,AudioBuffer[]>>;
const surfaces=['earth','grass','wood'] as const;
let recordings:Promise<PromiseSettledResult<ArrayBuffer>[]>|null=null;

/** Three small banks, cached across mounts; loading never delays entering the world. */
export function preloadFootsteps(){
 recordings??=Promise.allSettled(surfaces.map(async surface=>{
  const response=await fetch(publicAssetUrl(assets[surface].file),{signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error('Footstep recording unavailable');
  return response.arrayBuffer();
 }));
 return recordings;
}

export async function loadFootstepBank(context:BaseAudioContext):Promise<FootstepBank>{
 const bytes=await preloadFootsteps();
 const results=await Promise.allSettled(surfaces.map(async(surface,index)=>{
  const result=bytes[index];if(result.status!=='fulfilled')throw new Error('Missing recording');
  const decoded=await context.decodeAudioData(result.value.slice(0)),asset=assets[surface];
  const clips=asset.clips.map(region=>{
   const start=Math.round(region.offset/asset.sampleRate*decoded.sampleRate);
   const length=Math.round(region.length/asset.sampleRate*decoded.sampleRate);
   const buffer=context.createBuffer(1,length,decoded.sampleRate);
   buffer.getChannelData(0).set(decoded.getChannelData(0).subarray(start,start+length));
   return buffer;
  });
  return {surface,clips};
 }));
 const bank:FootstepBank={};
 for(const result of results)if(result.status==='fulfilled')bank[result.value.surface]=result.value.clips;
 return bank;
}
