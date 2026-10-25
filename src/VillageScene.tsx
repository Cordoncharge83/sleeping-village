import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {buildings,fenceLines,paths,trees,type Building,type Vec2,type Vec3} from './village';
import {atmosphere} from './atmosphere';
import {Model,Box,Sign,Bench,Table} from './SceneObjects';
import {Tavern} from './Tavern';

function Shell({building}:{building:Building}){
 const yard=building.id==='duel';
 const gable=useMemo(()=>{
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-3,3.13,-2.96,3,3.13,-2.96,0,5.95,-2.96],3));g.computeVertexNormals();return g;
 },[]);
 useEffect(()=>()=>gable.dispose(),[gable]);
 return <>
  {[-2,0,2].flatMap(x=>[-2,0,2].map(z=><Model key={x+':'+z} name="Floor_WoodDark" position={[x,.085,z]}/>))}
  {!yard&&<>
   {[-2,0,2].map(x=><Model key={'back'+x} name="Wall_Plaster_Straight" position={[x,.08,-3]} rotation={Math.PI}/>)}
   {[-2,0,2].flatMap(z=>[-1,1].map(side=><Model key={side+':'+z} name="Wall_Plaster_Straight" position={[side*3,.08,z]} rotation={side*Math.PI/2}/>))}
   <mesh geometry={gable} castShadow receiveShadow><meshStandardMaterial color="#b8a47c" side={THREE.DoubleSide} roughness={1}/></mesh>
   <Box p={[0,4.51,-2.91]} s={[.14,2.76,.14]}/>
  </>}
  <Model name="Roof_RoundTiles_6x6" position={[0,3.55,0]} scale={[.85,.55,.85]}/>
  {[-2.85,2.85].flatMap(x=>[-3,3].map(z=><Box key={x+':'+z} p={[x,1.55,z]} s={[.24,3.1,.24]}/>))}
  {!yard&&[-3,3].map(x=><Box key={'corner'+x} p={[x,1.64,-3.01]} s={[.24,3.16,.24]}/>)}
  <Box p={[0,3.05,3]} s={[6.1,.23,.23]}/>
  <Sign title={building.title} subtitle={building.subtitle} position={building.id==='smosh'?[0,3.65,4.65]:[0,2.64,3.16]} width={building.id==='smosh'?2.6:3.7}/>
  <Model name="Lantern_Wall" position={[2.65,1.4,2.85]} scale={.45} rotation={Math.PI}/>
  <mesh position={[2.65,1.94,2.88]}><sphereGeometry args={[.055,8,6]}/><meshStandardMaterial color="#ffd69b" emissive="#ffad56" emissiveIntensity={2}/></mesh>
  <pointLight position={[1.8,2.05,1.4]} color="#ffc184" intensity={9} distance={6} decay={2}/>
 </>;
}
function Workshop(){return <>
 <Model name="Workbench" position={[0,.09,-1.8]}/>
 <Model name="Book_Stack_1" position={[.55,.99,-1.8]} rotation={.2}/>
 <Model name="Shelf_Simple" position={[-.6,1.9,-2.85]}/>
 <Model name="Book_Stack_1" position={[-.7,2.01,-2.65]} rotation={-.3}/>
 <Model name="Anvil_Log" position={[-1.95,.09,.9]} scale={.9} rotation={.35}/>
 <Model name="Stool" position={[.75,.09,-.4]} rotation={.2}/>
 <Model name="Barrel" position={[2.25,.09,-1.9]}/>
 <Model name="Crate_Wooden" position={[2.2,.12,-.6]} scale={.7} rotation={-.1}/>
 <Model name="Lantern_Wall" position={[-2.68,1.1,.2]} scale={.6} rotation={Math.PI/2}/>
 <pointLight position={[-2.2,1.9,.2]} color="#ffbd6e" intensity={8} distance={6} decay={2}/>
 <Sign title="BUILT WITH CARE" subtitle="Sopra Steria · La Banque Postale" position={[0,1.9,-2.76]} width={2.7}/>
 </>;}
function Furnishings({id}:{id:Building['id']}){
 if(id==='workshop')return <Workshop/>;
 if(id==='smosh')return <Tavern/>;
 if(id==='bargainy')return <>
  <Box p={[0,.59,-1.7]} s={[3.6,1.05,.9]} color="#805b3d"/>
  <Box p={[0,1.15,-1.7]} s={[3.8,.13,1]} color="#b08b5e"/>
  <Model name="Book_Stack_1" position={[.9,1.23,-1.7]}/>
  <Sign title="LET’S MAKE A DEAL" subtitle="A place to practice negotiation" position={[0,2,-2.77]} width={2.8}/>
 </>;
 if(id==='atlas')return <>
  <Table position={[-1.6,.09,-.9]} scale={[1.4,1,2.1]}/>
  <Box p={[-1.6,1.12,-.9]} s={[1.1,.025,1.65]} color="#ded0a8"/>
  <Model name="Book_Stack_1" position={[-1.6,1.14,-1.45]}/>
  <Sign title="SCOUT. STUDY. PLAN." subtitle="Comp Atlas · showcase to come" position={[0,1.8,-2.77]} width={3.4}/>
 </>;
 return <>
  <Box p={[0,1.4,-2.85]} s={[3.5,2.8,.2]}/>
  <Sign title="THE NEXT ROUND" subtitle="DuelSync · tournament tools" position={[0,2,-2.7]} width={3.1}/>
  {[-1.9,1.9].map(x=><Table key={x} position={[x,.09,-.5]} scale={[1.1,1,1.5]}/>)}
  {[-1,1].map(side=><group key={side}>
   <Box p={[side*.9,1.05,-2.69]} s={[.7,.045,.025]} color="#d9c79d"/>
   <Box p={[side*.9,.65,-2.69]} s={[.7,.045,.025]} color="#d9c79d"/>
   <Box p={[side*.55,.85,-2.69]} s={[.045,.45,.025]} color="#d9c79d"/>
   <Box p={[side*.3,.85,-2.69]} s={[.5,.045,.025]} color="#d9c79d"/>
  </group>)}
 </>;
}
function Path({points,width,closed=false}:{points:Vec2[];width:number;closed?:boolean}){
 const geometry=useMemo(()=>{
  const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,.018,z)),closed,'centripetal');
  const vertices:number[]=[],indices:number[]=[];const count=Math.max(24,points.length*14);
  for(let i=0;i<=count;i++){
   const p=curve.getPoint(i/count),t=curve.getTangent(i/count),side=new THREE.Vector3(-t.z,0,t.x).normalize().multiplyScalar(width/2);
   vertices.push(p.x-side.x,p.y,p.z-side.z,p.x+side.x,p.y,p.z+side.z);
   if(i<count){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return g;
 },[points,width,closed]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} receiveShadow><meshStandardMaterial color={atmosphere.path} roughness={1} polygonOffset polygonOffsetFactor={-1}/></mesh>;
}
function Clearing({at,radius,scale=[1,1,1]}:{at:Vec2;radius:number;scale?:Vec3}){
 return <mesh position={[at[0],.024,at[1]]} rotation={[-Math.PI/2,0,0]} scale={scale} receiveShadow><circleGeometry args={[radius,40]}/><meshStandardMaterial color={atmosphere.path} roughness={1}/></mesh>;
}
function Fence({a,b}:{a:Vec2;b:Vec2}){
 const length=Math.hypot(b[0]-a[0],b[1]-a[1]),count=Math.ceil(length/2.6);
 return <group position={[(a[0]+b[0])/2,0,(a[1]+b[1])/2]} rotation={[0,-Math.atan2(b[1]-a[1],b[0]-a[0]),0]}>
  {[.5,1].map(y=><Box key={y} p={[0,y,0]} s={[length,.14,.12]} color="#806447"/>)}
  {Array.from({length:count+1},(_,i)=><Box key={i} p={[-length/2+i*length/count,.67,0]} s={[.19,1.34,.19]} color="#6c533d"/>)}
 </group>;
}
function FutureClearing(){return <>
 <Clearing at={[0,-28.5]} radius={6} scale={[1,.72,1]}/>
 <Box p={[-3,.2,-29]} s={[3,.4,3]} color="#9a927b"/>
 {[-1,1].map(side=><Box key={side} p={[-3+side*1.3,.5,-29]} s={[.18,.6,3]} color="#b99a6b"/>)}
 <Box p={[-3,.5,-30.3]} s={[2.6,.6,.18]} color="#b99a6b"/>
 <Box p={[3.5,.55,-29]} s={[2,1.1,2]} color="#8c704b"/>
 <Sign title="MANART" subtitle="Further development planned" position={[-3,1.2,-27.4]} width={2.6}/>
 <Sign title="PENGUIN BOARD GAME" subtitle="Early concept · rules taking shape" position={[3.4,1.2,-27.7]} width={2.7}/>
 <Sign title="IDEAS TAKING SHAPE" subtitle="The future clearing" position={[0,2.7,-31.7]} width={3.5}/>
 {[-1.5,1.5].map(x=><Box key={x} p={[x,1.35,-31.76]} s={[.14,2.7,.14]}/>)}
 <Box p={[-3,.7,-27.46]} s={[.14,1.4,.14]}/><Box p={[3.4,.7,-27.76]} s={[.14,1.4,.14]}/>
 </>;}
// Keep decorative undergrowth away from usable routes and entrances.
function distanceToSegment(p:Vec2,a:Vec2,b:Vec2){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dz);}
const undergrowth:Vec2[]=[];
for(let i=0;i<420&&undergrowth.length<130;i++){
 const p:Vec2=[-25+(i*17.39%50),-34+(i*13.71%64)];
 if(Math.hypot(p[0],p[1])<7||buildings.some(b=>Math.abs(b.at[0]-p[0])<5&&Math.abs(b.at[1]-p[1])<5)||Math.abs(p[0])<7&&p[1]<-24)continue;
 if(paths.some(path=>path.points.some((a,j)=>{const b=path.points[(j+1)%path.points.length];return (path.closed||j<path.points.length-1)&&distanceToSegment(p,a,b)<path.width/2+1;})))continue;
 undergrowth.push(p);
}
export function VillageScene(){return <>
 <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[170,180]}/><meshStandardMaterial color={atmosphere.ground} roughness={1}/></mesh>
 {paths.map((p,i)=><Path key={i} {...p}/>)}
 <Clearing at={[0,0]} radius={6.4}/>
 <Clearing at={[-8.5,1]} radius={3.4}/><Clearing at={[8,-14]} radius={3.5}/>
 {trees.map(([x,z,s,kind],i)=><Model key={'t'+i} name={kind?'MapleTree_1':'BirchTree_1'} position={[x,0,z]} scale={s} rotation={i*1.8} shadow={Math.abs(x)<25&&Math.abs(z)<34}/>)}
 {undergrowth.map(([x,z],i)=><Model key={'g'+i} name={i%7===0?'Bush_Small':'Grass_Small'} position={[x,0,z]} scale={i%7===0?.35:.7+(i%3)*.15} rotation={i*2.4} shadow={false}/>)}
 {fenceLines.map((f,i)=><Fence key={i} {...f}/>)}
 {buildings.map(b=><group key={b.id} position={[b.at[0],0,b.at[1]]} rotation={[0,b.rotation,0]}><Shell building={b}/><Furnishings id={b.id}/></group>)}
 <Bench position={[-2.5,0,-2.5]} rotation={Math.PI/2}/><Bench position={[2.5,0,-2.5]} rotation={Math.PI/2}/>
 <FutureClearing/>
 <Box p={[2.3,.9,20]} s={[.15,1.8,.15]}/><Sign title="THE SLEEPING VILLAGE" subtitle="Workshop ←    Square ↑" position={[2.3,1.8,20]} width={2.8}/>
 <Box p={[2.3,.9,-21.5]} s={[.15,1.8,.15]}/><Sign title="AROUND THE VILLAGE" subtitle="Map lodge ←    Tournament yard →" position={[2.3,1.8,-21.5]} width={3.3}/>
 </>;}
