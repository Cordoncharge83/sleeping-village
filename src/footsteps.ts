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

/** Accumulate actual travel, never key presses: walls, idle and teleports stay quiet. */
export class FootstepTracker{
 private last:{x:number;z:number}|null=null;
 private distance=0;
 private first=true;
 private still=0;
 private foot=0;
 reset(){this.last=null;this.distance=0;this.first=true;this.still=0;}
 update(x:number,z:number,delta:number,active:boolean,running:boolean){
  const previous=this.last;this.last={x,z};
  if(!active||!previous){this.distance=0;this.first=true;this.still=0;return null;}
  const travel=Math.hypot(x-previous.x,z-previous.z);
  if(travel>1.5){this.distance=0;this.first=true;return null;}
  if(travel<.0005){this.still+=delta;if(this.still>.12){this.distance=0;this.first=true;}return null;}
  this.still=0;this.distance+=travel;
  const stride=this.first ? .14 : running ? 1.35 : 1.05;
  if(this.distance<stride)return null;
  this.distance%=stride;this.first=false;this.foot=1-this.foot;
  return {surface:footstepSurfaceAt(x,z),running,pan:this.foot ? .09 : -.09};
 }
}
