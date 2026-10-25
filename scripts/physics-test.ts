import assert from 'node:assert/strict';
import {createSimulation} from '../src/physics.ts';
import {SPAWN,BOUNDS,buildings,localPoint,places,nearbyPlace,type Vec2} from '../src/village.ts';
import {WALK_SPEED,RUN_SPEED} from '../src/tuning.ts';
const s=await createSimulation();
function settle(){for(let i=0;i<30;i++)s.step(0,0);}
function walkTo(target:Vec2,speed=WALK_SPEED){
 for(let i=0;i<2400;i++){
  const p=s.body.translation(),dx=target[0]-p.x,dz=target[1]-p.z,d=Math.hypot(dx,dz);
  if(d<.045)return;
  const step=Math.min(speed/60,d);s.step(dx/d*step,dz/d*step);
 }
 const p=s.body.translation();assert.fail(`Blocked on route to ${target}; stopped at ${p.x.toFixed(2)}, ${p.z.toFixed(2)}`);
}
try {
 settle();assert.ok(Math.abs(s.body.translation().y-.725)<.04,'Character rests on ground');
 s.reset();for(let i=0;i<120;i++)s.step(0,-WALK_SPEED/60);
 assert.ok(Math.abs(s.body.translation().z-(SPAWN[2]-5.8))<.05,'Walking covers 5.8 metres in two seconds');
 s.reset();for(let i=0;i<60;i++)s.step(0,-RUN_SPEED/60);
 assert.ok(Math.abs(s.body.translation().z-(SPAWN[2]-5))<.05,'Running covers five metres in one second');
 // A single continuous trip from spawn visits every interaction through its actual entrance.
 s.reset();walkTo([-1,16]);walkTo([-4,14]);
 const workshop=buildings[0];walkTo(localPoint(workshop,0,4));walkTo(places.workshop.at);
 assert.equal(nearbyPlace(s.body.translation().x,s.body.translation().z),'workshop');
 assert.ok(s.body.translation().y>.76,'Player steps onto the workshop floor');
 for(let i=0;i<120;i++)s.step(-WALK_SPEED/60,0);
 assert.ok(s.body.translation().x>-12.1,'Workbench blocks forward movement');
 walkTo(places.workshop.at);walkTo(localPoint(workshop,0,4));walkTo([-4,14]);walkTo([0,10]);walkTo([0,3]);
 assert.equal(nearbyPlace(s.body.translation().x,s.body.translation().z),'square');
 const tour:[number,Vec2[]][]=[
  [1,[[-6,8],[-7,1]]], [3,[[-7,1],[-6,-14]]], [4,[[0,-20],[6,-14]]], [2,[[6,-14],[7,1]]],
 ];
 for(const [index,route] of tour){
  for(const p of route)walkTo(p,RUN_SPEED);
  const b=buildings[index];walkTo(localPoint(b,0,4));walkTo(places[b.id].at);
  assert.equal(nearbyPlace(s.body.translation().x,s.body.translation().z),b.id,`${b.id} is reachable`);
  assert.ok(s.body.translation().y>.76,`${b.id} floor is reachable without jumping`);
  if(b.id==='smosh'){
   assert.notEqual(nearbyPlace(...localPoint(b,-3.4,.4)),'smosh','Ledger cannot be opened through the outer wall');
   assert.notEqual(nearbyPlace(...localPoint(b,0,3)),'smosh','Ledger requires approaching the table');
   walkTo(localPoint(b,0,.15));
   for(let i=0;i<90;i++)s.step(-Math.cos(b.rotation)*WALK_SPEED/60,Math.sin(b.rotation)*WALK_SPEED/60);
   let p=s.body.translation();
   assert.ok((p.x-b.at[0])*Math.cos(b.rotation)-(p.z-b.at[1])*Math.sin(b.rotation)>-.6,'Ledger table blocks walking through it');
   walkTo(localPoint(b,0,.15));walkTo(localPoint(b,0,-.8));
   for(let i=0;i<90;i++)s.step(-Math.sin(b.rotation)*WALK_SPEED/60,-Math.cos(b.rotation)*WALK_SPEED/60);
   p=s.body.translation();
   assert.ok((p.x-b.at[0])*Math.sin(b.rotation)+(p.z-b.at[1])*Math.cos(b.rotation)>-1.5,'Serving counter blocks walking through it');
   walkTo(localPoint(b,0,.15));walkTo(places[b.id].at);
  }
  if(b.id!=='duel'){
   const origin=localPoint(b,0,-2);
   const back=s.cameraDistance({x:origin[0],y:1.5,z:origin[1]},{x:-Math.sin(b.rotation),y:0,z:-Math.cos(b.rotation)},4.5);
   assert.ok(back<1,`${b.id} rotated rear wall stops camera`);
   for(let i=0;i<120;i++)s.step(Math.cos(b.rotation)*WALK_SPEED/60,-Math.sin(b.rotation)*WALK_SPEED/60);
   const p=s.body.translation(),localX=(p.x-b.at[0])*Math.cos(b.rotation)-(p.z-b.at[1])*Math.sin(b.rotation);
   assert.ok(localX<2.7,`${b.id} rotated side wall blocks player`);
   walkTo(places[b.id].at);
  }
  walkTo(localPoint(b,0,4));walkTo(route[route.length-1]);
 }
 walkTo([6,-14]);walkTo([0,-20]);walkTo([0,-24]);walkTo(places.future.at);
 assert.equal(nearbyPlace(s.body.translation().x,s.body.translation().z),'future');
 // Return through the opposite branch to ensure the loop doesn't require a reset.
 walkTo([0,-20]);walkTo([-6,-14]);walkTo([-7,1]);walkTo([-6,8]);walkTo([0,10]);walkTo([0,27]);
 for(let i=0;i<200;i++)s.step(0,RUN_SPEED/60);
 assert.ok(s.body.translation().z<BOUNDS.front-.4,'Boundary prevents leaving the village');
 s.reset();settle();assert.ok(Math.hypot(s.body.translation().x-SPAWN[0],s.body.translation().z-SPAWN[2])<.01,'Reset returns to entrance');
 console.log('PASS: walking and sprint speeds; continuous tour of all seven stops; raised entrances; workshop furniture; rotated walls; camera clearance; loop return; scene boundary; reset.');
}finally{s.dispose();}
