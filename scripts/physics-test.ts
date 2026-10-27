import assert from 'node:assert/strict';
import {createSimulation} from '../src/physics.ts';
import {SPAWN,BOUNDS,buildings,localPoint,places,nearbyPlace,workshopStations,workshopStationAt,schoolhouseStations,schoolhouseStationAt,GATE_Z,type Vec2} from '../src/village.ts';
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
 s.reset();walkTo([4,22]);walkTo([1,17]);walkTo([-1,11]);walkTo([0,4]);
 assert.equal(nearbyPlace(s.body.translation().x,s.body.translation().z),'square');
 const tour:[number,Vec2[]][]=[
  [0,[[0,6],[-6,8],[-9,12]]],
  [5,[[-4,3],[-6,1],[-12,1],[-16,0]]],
  [1,[[4,4],[8,7],[13,10]]],
  [2,[[4,4],[8,7],[13,10],[22,13],[27,13]]],
  [3,[[4,2],[4,-4],[10,-6],[18,-5]]],
  [4,[[4,2],[4,-4],[10,-6],[18,-5],[27,-2],[29,-1]]],
 ];
 for(const [index,route] of tour){
  for(const p of route)walkTo(p,RUN_SPEED);
  const b=buildings[index];walkTo(localPoint(b,0,4));walkTo(places[b.id].at);
  assert.equal(nearbyPlace(s.body.translation().x,s.body.translation().z),b.id,`${b.id} is reachable`);
  assert.ok(s.body.translation().y>.76,`${b.id} floor is reachable without jumping`);
  if(b.id==='workshop'){
   for(let i=0;i<120;i++)s.step(-WALK_SPEED/60,0);
   assert.ok(s.body.translation().x>b.at[0]-1.1,'Workbench blocks forward movement');
   walkTo(places.workshop.at);
   for(const [page,station] of workshopStations.entries()){
    walkTo(localPoint(b,0,.6));walkTo(localPoint(b,...station.at));
    const p=s.body.translation();
    assert.equal(workshopStationAt(p.x,p.z),page,'Each display opens its own workshop page');
    assert.equal(nearbyPlace(p.x,p.z),'workshop','Displays share one discovery');
    if(page>0){
     const side=page===1?-1:1;
     for(let i=0;i<90;i++)s.step(side*Math.cos(b.rotation)*WALK_SPEED/60,-side*Math.sin(b.rotation)*WALK_SPEED/60);
     const q=s.body.translation(),localX=(q.x-b.at[0])*Math.cos(b.rotation)-(q.z-b.at[1])*Math.sin(b.rotation);
     assert.ok(Math.abs(localX)<1.15,'Display desks block walking through them');
     walkTo(localPoint(b,...station.at));
    }
    walkTo(localPoint(b,0,.6));
   }
   for(const point of [[-3.4,.45],[3.4,1.35],[0,3.2]] as Vec2[])assert.equal(workshopStationAt(...localPoint(b,...point)),null,'No reading through walls or outside entrance');
   walkTo(places.workshop.at);
  }
  if(b.id==='education'){
   for(const [page,station] of schoolhouseStations.entries()){
    walkTo(localPoint(b,0,.55));walkTo(localPoint(b,...station.at));
    const p=s.body.translation();
    assert.equal(schoolhouseStationAt(p.x,p.z),page,'Schoolhouse displays target education and skills separately');
    assert.equal(nearbyPlace(p.x,p.z),'education','Both displays share the schoolhouse discovery');
   }
   // The skills table, study desk, bookcase, and reading bench all have solid footprints.
   const obstacles:[Vec2,Vec2,number][]=[[[1,.45],[1,0],1.2],[[0,-.4],[0,-1],1.15],[[-1.4,-.7],[-1,0],2.2],[[-1.4,1.35],[-1,0],2]];
   for(const [approach,direction,limit] of obstacles){
    walkTo(localPoint(b,0,.55));walkTo(localPoint(b,...approach));
    for(let i=0;i<90;i++)s.step((direction[0]*Math.cos(b.rotation)+direction[1]*Math.sin(b.rotation))*WALK_SPEED/60,(-direction[0]*Math.sin(b.rotation)+direction[1]*Math.cos(b.rotation))*WALK_SPEED/60);
    const p=s.body.translation(),lx=(p.x-b.at[0])*Math.cos(b.rotation)-(p.z-b.at[1])*Math.sin(b.rotation),lz=(p.x-b.at[0])*Math.sin(b.rotation)+(p.z-b.at[1])*Math.cos(b.rotation);
    assert.ok(lx*direction[0]+lz*direction[1]<limit,'Schoolhouse furniture blocks the traveler');
    walkTo(localPoint(b,...approach));
   }
   for(const point of [[-3.4,0],[3.4,.45],[0,3.2]] as Vec2[])assert.equal(schoolhouseStationAt(...localPoint(b,...point)),null,'No schoolhouse interaction through walls or outside entrance');
   walkTo(localPoint(b,0,.55));walkTo(places.education.at);
  }
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
  walkTo(localPoint(b,0,4));for(const p of [...route].reverse())walkTo(p,RUN_SPEED);walkTo([0,4]);
 }
 // Closed homes stop both the player and the camera.
 walkTo([4,2]);walkTo([4,-4]);walkTo([10,-6]);walkTo([12,-4]);
 for(let i=0;i<120;i++)s.step(0,WALK_SPEED/60);
 assert.ok(s.body.translation().z<-2.5,'Closed cottage cannot be entered');
 assert.ok(s.cameraDistance({x:12,y:1.4,z:-4},{x:0,y:0,z:1},4)<1.5,'Cottage blocks the camera');
 walkTo([12,-4]);walkTo([10,-6]);walkTo([4,-4]);walkTo([0,-6]);walkTo([1,-10]);walkTo([0,-14]);
 assert.equal(nearbyPlace(0,-14),'gate');
 for(let i=0;i<120;i++)s.step(0,-RUN_SPEED/60);
 assert.ok(s.body.translation().z>GATE_Z+.3,'Locked gate blocks the traveler');
 assert.equal(nearbyPlace(...places.future.at),null,'Future cannot be inspected while locked');
 // Try both sides: the hedge/fence joins the world edge, with no path around the gate.
 for(const x of [-3.5,3.5]){
  walkTo([0,-14]);walkTo([x,-15.5]);
  for(let i=0;i<90;i++)s.step(0,-RUN_SPEED/60);
  assert.ok(s.body.translation().z>GATE_Z,'Cannot bypass the locked gate through its fence');
  walkTo([x,-15.5]);walkTo([0,-14]);
 }
 s.setGateOpen(true);walkTo([0,-20]);walkTo(places.future.at);
 assert.equal(nearbyPlace(s.body.translation().x,s.body.translation().z,true),'future');
 walkTo([0,-20]);walkTo([0,-14]);walkTo([1,-10]);walkTo([0,-6]);walkTo([4,-4]);walkTo([4,2]);walkTo([0,4]);
 walkTo([-1,11]);walkTo([1,17]);walkTo([4,22]);walkTo([4,28]);
 for(let i=0;i<200;i++)s.step(0,RUN_SPEED/60);
 assert.ok(s.body.translation().z<BOUNDS.front-.4,'Boundary prevents leaving the village');
 s.reset();settle();assert.ok(Math.hypot(s.body.translation().x-SPAWN[0],s.body.translation().z-SPAWN[2])<.01,'Reset returns to entrance');
 console.log('PASS: walking and sprint speeds; continuous tour of six main entries; closed cottages; locked gate and fence bypass prevention; open gate and bonus clearing; raised entrances; furniture; rotated walls; camera clearance; return; scene boundary; reset.');
}finally{s.dispose();}
