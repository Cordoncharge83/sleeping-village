import {buildings,paths,type Vec2} from './village.ts';
import type {GroundSound} from './audio-design.ts';

function segmentDistance(x:number,z:number,a:Vec2,b:Vec2){
 const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));
 return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);
}
export function footstepSurfaceAt(x:number,z:number):GroundSound{
 for(const building of buildings){
  const dx=x-building.at[0],dz=z-building.at[1],c=Math.cos(building.rotation),s=Math.sin(building.rotation);
  if(Math.abs(dx*c-dz*s)<2.9&&Math.abs(dx*s+dz*c)<2.95)return 'wood';
 }
 if(Math.hypot(x,z+1)<5.7)return 'earth';
 for(const path of paths){
  for(let i=0;i<path.points.length-(path.closed?0:1);i++)if(segmentDistance(x,z,path.points[i],path.points[(i+1)%path.points.length])<path.width/2)return 'earth';
 }
 return 'grass';
}

export type Gait='Idle'|'Walk'|'Run';
export type FootstepFrame={x:number;z:number;delta:number;active:boolean;clip:Gait;time:number;duration:number};
// Heel contacts in Traveler_animated.glb, expressed as fractions of a full stride.
// Use the action's actual local time, including its playback speed and loop wrap.
export const FOOT_CONTACTS={Walk:[{phase:0,pan:-.09},{phase:.5,pan:.09}],Run:[{phase:.45,pan:.09},{phase:.95,pan:-.09}]} as const;

/** Animation contacts provide cadence; actual travel gates impacts at walls/idle. */
export class FootstepTracker{
 private last:FootstepFrame|null=null;
 private sinceStep=Infinity;
 reset(){this.last=null;this.sinceStep=Infinity;}
 update(frame:FootstepFrame){
  const previous=this.last;this.last=frame;
  const {x,z,delta,active,clip,time,duration}=frame;
  this.sinceStep+=Math.max(0,delta);
  if(!active||!previous||!previous.active||clip==='Idle'||delta<=0||duration<=0)return null;
  const travel=Math.hypot(x-previous.x,z-previous.z);
  if(travel>1.5||travel/delta<.08)return null;
  let start=previous.clip===clip?previous.time/duration:-.000001,end=time/duration;
  if(end<start)end+=1;
  // Ignore seek/reset jumps instead of replaying missed contacts.
  if(end-start>.5||this.sinceStep<.08)return null;
  for(const contact of FOOT_CONTACTS[clip]){
   const crossing=contact.phase+(contact.phase<=start?1:0);
   if(crossing>start&&crossing<=end){this.sinceStep=0;return {surface:footstepSurfaceAt(x,z),running:clip==='Run',pan:contact.pan};}
  }
  return null;
 }
}
