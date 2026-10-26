import RAPIER from '@dimforge/rapier3d-compat';
import {solids,SPAWN,gateSolid} from './village.ts';
let ready:Promise<void>|undefined;
export async function createSimulation() {
 await (ready??=RAPIER.init());
 const world=new RAPIER.World({x:0,y:-9.81,z:0});
 const gate=world.createCollider(RAPIER.ColliderDesc.cuboid(...gateSolid.s.map(n=>n/2) as [number,number,number]).setTranslation(...gateSolid.p));
 for(const b of solids) {
  const angle=b.rotation??0;
  world.createCollider(RAPIER.ColliderDesc.cuboid(b.s[0]/2,b.s[1]/2,b.s[2]/2).setTranslation(...b.p).setRotation({x:0,y:Math.sin(angle/2),z:0,w:Math.cos(angle/2)}));
 }
 const body=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...SPAWN));
 const collider=world.createCollider(RAPIER.ColliderDesc.capsule(.48,.23),body);
 const controller=world.createCharacterController(.015);
 controller.enableAutostep(.19,.2,false);controller.enableSnapToGround(.25);
 controller.setMaxSlopeClimbAngle(Math.PI/4);controller.setMinSlopeSlideAngle(Math.PI/3);
 world.timestep=1/60;
 world.step();
 let verticalVelocity=0;
 return {world,body,collider,controller,
  setGateOpen(open:boolean){if(gate.isEnabled()===open)gate.setEnabled(!open);},
  step(dx:number,dz:number) {
   verticalVelocity=controller.computedGrounded()?-.4:Math.max(-15,verticalVelocity-9.81/60);
   controller.computeColliderMovement(collider,{x:dx,y:verticalVelocity/60,z:dz});
   const p=body.translation(),m=controller.computedMovement();
   body.setNextKinematicTranslation({x:p.x+m.x,y:p.y+m.y,z:p.z+m.z});world.step();
  },
  reset(){verticalVelocity=0;body.setTranslation({x:SPAWN[0],y:SPAWN[1],z:SPAWN[2]},true);body.setNextKinematicTranslation({x:SPAWN[0],y:SPAWN[1],z:SPAWN[2]});world.step();},
  cameraDistance(origin:{x:number,y:number,z:number},direction:{x:number,y:number,z:number},distance:number) {
   const hit=world.castRay(new RAPIER.Ray(origin,direction),distance,true,undefined,undefined,collider);
   return hit?Math.max(.45,hit.timeOfImpact-.22):distance;
  },
  dispose(){world.removeCharacterController(controller);world.free();}
 };
}
export type Simulation=Awaited<ReturnType<typeof createSimulation>>;
