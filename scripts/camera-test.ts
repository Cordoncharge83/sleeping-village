import assert from 'node:assert/strict';
import {Vector3} from 'three';
import {FollowCamera,InterpolatedPosition,PHYSICS_STEP} from '../src/player-view.ts';
import {createSimulation} from '../src/physics.ts';
import {RUN_SPEED} from '../src/tuning.ts';

// The view must follow sprinting in every direction without periodically catching up.
for(const fps of [30,60,90,144]) {
 for(const direction of [new Vector3(0,0,-1),new Vector3(0,0,1),new Vector3(1,0,0)]) {
  const motion=new InterpolatedPosition(),camera=new FollowCamera(),physical=new Vector3();
  motion.reset(physical);
  const dt=1/fps;let previousCamera:Vector3|undefined;
  for(let frame=0;frame<fps*4;frame++) {
   const position=motion.advance(dt,()=>physical.addScaledVector(direction,RUN_SPEED*PHYSICS_STEP));
   camera.update(position,0,.23,dt,()=>4.5);
   assert.ok(Math.abs(camera.position.distanceTo(position)-4.5)<1e-8,'No camera distance drift while sprinting');
   if(previousCamera&&frame>2) {
    const displacement=camera.position.clone().sub(previousCamera);
    assert.ok(displacement.distanceTo(direction.clone().multiplyScalar(RUN_SPEED*dt))<1e-8,`No sprint jumps at ${fps} FPS`);
   }
   previousCamera=camera.position.clone();
  }
 }
}

// Uneven render times must not expose discrete physics steps to the visible traveler.
{
 const motion=new InterpolatedPosition(),camera=new FollowCamera(),physical=new Vector3();
 motion.reset(physical);let elapsed=0;
 for(let frame=0;frame<360;frame++) {
  const dt=[1/144,1/60,1/90,1/30,1/120][frame%5];elapsed+=dt;
  const position=motion.advance(dt,()=>{physical.z-=RUN_SPEED*PHYSICS_STEP;return physical;});
  camera.update(position,0,.23,dt,()=>4.5);
  assert.ok(Math.abs(position.z+RUN_SPEED*Math.max(0,elapsed-PHYSICS_STEP))<1e-7,'Smooth movement across uneven frame times');
 }
 const pivot=new Vector3(12,1.3,7);motion.reset(pivot);camera.reset();
 camera.update(motion.advance(0,()=>pivot),0,.23,1/60,()=>4.5);
 assert.ok(camera.position.distanceTo(pivot)>4.49,'Reset does not sweep through the old position');
}

// Preserve the camera's wall protection and ease it back when the obstacle clears.
{
 const camera=new FollowCamera(),pivot=new Vector3(0,1.3,0);
 camera.update(pivot,0,.23,1/60,()=>4.5);
 camera.update(pivot,0,.23,1/60,()=>1);
 assert.ok(camera.position.distanceTo(pivot)<=1.000001,'Camera retracts immediately before a wall');
 camera.update(pivot,0,.23,1/60,()=>4.5);
 assert.ok(camera.position.distanceTo(pivot)>1&&camera.position.distanceTo(pivot)<2,'Camera returns gently after clearing a wall');
}

// Exercise the same controller, render interpolation, and camera used by the running scene.
for(const fps of [30,60,144]) {
 const simulation=await createSimulation();
 try {
  const motion=new InterpolatedPosition(),camera=new FollowCamera(),pivot=new Vector3();
  motion.reset(simulation.body.translation());
  for(let frame=0;frame<fps*2;frame++) {
   const p=motion.advance(1/fps,()=>{simulation.step(0,-RUN_SPEED*PHYSICS_STEP);return simulation.body.translation();});
   pivot.set(p.x,p.y+.55,p.z);camera.update(pivot,0,.23,1/fps,simulation.cameraDistance);
   assert.ok(Math.abs(camera.position.distanceTo(pivot)-4.5)<1e-5,'No false camera retraction while sprinting along the path');
  }
 }finally{simulation.dispose();}
}
console.log('PASS: sprint follow at 30/60/90/144 FPS, uneven frame times, obstruction clearance, reset, and live physics integration.');
