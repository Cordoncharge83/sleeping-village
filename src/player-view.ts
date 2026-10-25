import {Vector3} from 'three';

type Position = {x:number;y:number;z:number};
type Clearance = (origin:Position,direction:Position,distance:number)=>number;
export const PHYSICS_STEP = 1/60;

// Render between physics snapshots so the traveler and camera share one smooth position.
export class InterpolatedPosition {
 readonly rendered = new Vector3();
 private previous = new Vector3();
 private current = new Vector3();
 private accumulator = 0;

 reset(position:Position) {
  this.previous.copy(position);
  this.current.copy(position);
  this.rendered.copy(position);
  this.accumulator=0;
 }

 advance(delta:number,step:()=>Position) {
  this.accumulator+=delta;
  while(this.accumulator>=PHYSICS_STEP) {
   this.previous.copy(this.current);
   this.current.copy(step());
   this.accumulator-=PHYSICS_STEP;
  }
  return this.rendered.lerpVectors(this.previous,this.current,this.accumulator/PHYSICS_STEP);
 }
}

export class FollowCamera {
 readonly position = new Vector3();
 readonly target = new Vector3();
 private direction = new Vector3();
 private desiredDirection = new Vector3();
 private boom = 4.5;
 private initialized = false;

 reset() {this.initialized=false;}

 update(pivot:Position,yaw:number,pitch:number,delta:number,clearance:Clearance) {
  this.desiredDirection.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));
  if(!this.initialized)this.direction.copy(this.desiredDirection);
  else {
   this.direction.lerp(this.desiredDirection,1-Math.exp(-14*delta));
   if(this.direction.lengthSq()<1e-8)this.direction.copy(this.desiredDirection);
   this.direction.normalize();
  }

  const allowed=Math.max(.45,Math.min(4.5,clearance(pivot,this.direction,4.5)));
  // Only real obstacles can shorten the boom immediately; moving faster cannot trigger a snap.
  if(!this.initialized||allowed<this.boom)this.boom=allowed;
  else this.boom+=(allowed-this.boom)*(1-Math.exp(-10*delta));

  this.position.copy(pivot).addScaledVector(this.direction,this.boom);
  const horizontal=Math.hypot(this.direction.x,this.direction.z);
  this.target.copy(pivot);
  this.target.x+=this.direction.z/horizontal*.4;
  this.target.z-=this.direction.x/horizontal*.4;
  this.initialized=true;
  return this;
 }
}
