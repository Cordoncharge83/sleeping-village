import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {buildings,cottages,hedges,fenceLines,paths,trees,GATE_Z,type Cottage,type Building,type Vec2,type Vec3} from './village';
import {atmosphere} from './atmosphere';
import {Model,Box,Sign,Bench,Table} from './SceneObjects';
import {Tavern} from './Tavern';
import {Workshop} from './Workshop';

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
  <Sign title={building.title} subtitle={building.subtitle} position={building.id==='smosh'?[0,3.65,4.65]:building.id==='workshop'?[0,3.65,3.16]:[0,2.64,3.16]} width={building.id==='smosh'?2.6:building.id==='workshop'?3.1:3.7}/>
  <Model name="Lantern_Wall" position={[2.65,1.4,2.85]} scale={.45} rotation={Math.PI}/>
  <mesh position={[2.65,1.94,2.88]}><sphereGeometry args={[.055,8,6]}/><meshStandardMaterial color="#ffd69b" emissive="#ffad56" emissiveIntensity={2}/></mesh>
  <pointLight position={[1.8,2.05,1.4]} color="#ffc184" intensity={9} distance={6} decay={2}/>
 </>;
}
function Furnishings({id}:{id:Building['id']}){
 if(id==='workshop')return <Workshop/>;
 if(id==='smosh')return <Tavern/>;
 if(id==='education')return <>
  <Table position={[0,.09,-1.7]} scale={[2.2,1,1.2]}/>
  <Model name="Book_Stack_1" position={[0,1.14,-1.5]}/>
  <Sign title="A FOUNDATION FOR MAKING" subtitle="Education · skills · lessons learned" position={[0,2.1,-2.77]} width={3.7}/>
 </>;
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
 return <>
  <mesh geometry={geometry} receiveShadow><meshStandardMaterial color={atmosphere.path} roughness={1} polygonOffset polygonOffsetFactor={-1}/></mesh>
  {!closed&&[points[0],points[points.length-1]].map((at,i)=><Clearing key={i} at={at} radius={width/2}/>)}
 </>;
}
function EntranceApron(){return <mesh position={[0,.028,4]} rotation={[-Math.PI/2,0,0]} receiveShadow>
 <planeGeometry args={[5.4,2.3]}/><meshStandardMaterial color={atmosphere.path} roughness={1}/>
 </mesh>;}
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
function ClosedCottage({cottage:c}:{cottage:Cottage}){
 const gable=useMemo(()=>{
  const g=new THREE.BufferGeometry(),vertices:number[]=[];
  for(const side of [-1,1])vertices.push(-c.width/2,3,side*c.depth/2,c.width/2,3,side*c.depth/2,0,5.25,side*c.depth/2);
  g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();return g;
 },[c]);
 useEffect(()=>()=>gable.dispose(),[gable]);
 return <group position={[c.at[0],0,c.at[1]]} rotation={[0,c.rotation,0]}>
 <Box p={[0,1.5,0]} s={[c.width,3,c.depth]} color={c.color}/>
 <mesh geometry={gable} castShadow receiveShadow><meshStandardMaterial color={c.color} side={THREE.DoubleSide} roughness={1}/></mesh>
 <Box p={[0,4.04,c.depth/2+.02]} s={[.14,2.15,.12]}/>
 <Model name="Roof_RoundTiles_6x6" position={[0,3.25,0]} scale={[c.width/7,.46,c.depth/7]}/>
 <Box p={[0,.18,0]} s={[c.width+.12,.36,c.depth+.12]} color="#747567"/>
 {[-1,1].map(side=><Box key={side} p={[side*(c.width/2-.1),1.6,c.depth/2+.02]} s={[.18,2.8,.16]}/>)}
 <Box p={[0,2.9,c.depth/2+.02]} s={[c.width,.18,.16]}/>
 <Box p={[.35,1,c.depth/2+.04]} s={[1.05,1.9,.12]} color="#574b3b"/>
 <Box p={[.7,1.02,c.depth/2+.12]} s={[.09,.09,.06]} color="#ba9860"/>
 <Box p={[-1.15,1.8,c.depth/2+.07]} s={[.85,.95,.12]} color="#4b4231"/>
 <mesh position={[-1.15,1.8,c.depth/2+.14]}><planeGeometry args={[.65,.75]}/><meshStandardMaterial color="#c4a775" emissive="#b97e38" emissiveIntensity={.35}/></mesh>
 <Box p={[-1.15,1.8,c.depth/2+.16]} s={[.065,.8,.05]}/>
 <Box p={[-1.15,1.8,c.depth/2+.16]} s={[.7,.065,.05]}/>
 <Box p={[c.width*.28,3.8,-c.depth*.2]} s={[.65,1.7,.7]} color="#777366"/>
 </group>;}
function GardenGate({open,count}:{open:boolean;count:number}){return <group position={[0,0,GATE_Z]}>
 {[-1,1].map(side=><group key={side}>
  <Box p={[side*2.6,1.6,0]} s={[.4,3.2,.4]} color="#62503c"/>
  <group position={[side*2.4,0,0]} rotation={[0,open?side*Math.PI/2:0,0]}>
   {[.45,1.7].map(y=><Box key={y} p={[-side*1.2,y,0]} s={[2.4,.18,.16]} color="#725538"/>)}
   {Array.from({length:6},(_,i)=><Box key={i} p={[-side*(.2+i*.4),1.1,0]} s={[.2,2.2,.13]} color="#806448"/>)}
  </group>
 </group>)}
 <Box p={[0,3.12,0]} s={[5.6,.28,.4]}/>
 <Sign title={open?'THE NEXT CHAPTER':'SIX STORIES, ONE MORE PATH'} subtitle={open?'The garden is open. Come in.':`${count} / 6 discovered · Explore the village`} position={[0,3.3,.25]} width={4}/>
 {Array.from({length:6},(_,i)=><mesh key={i} position={[-.9+i*.36,2.7,.24]} rotation={[0,0,Math.PI/4]}><boxGeometry args={[.16,.16,.04]}/><meshStandardMaterial color={i<count?'#e6bc6d':'#645845'} emissive={i<count?'#b78539':'#000000'} emissiveIntensity={.4}/></mesh>)}
 </group>;}
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
 if(Math.hypot(p[0],p[1])<7||[...buildings,...cottages].some(b=>Math.abs(b.at[0]-p[0])<5&&Math.abs(b.at[1]-p[1])<5)||Math.abs(p[0])<7&&p[1]<-24)continue;
 if(paths.some(path=>path.points.some((a,j)=>{const b=path.points[(j+1)%path.points.length];return (path.closed||j<path.points.length-1)&&distanceToSegment(p,a,b)<path.width/2+1;})))continue;
 undergrowth.push(p);
}
export function VillageScene({gateOpen,discoveryCount}:{gateOpen:boolean;discoveryCount:number}){return <>
 <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[170,180]}/><meshStandardMaterial color={atmosphere.ground} roughness={1}/></mesh>
 {paths.map((p,i)=><Path key={i} {...p}/>)}
 <Clearing at={[0,-1]} radius={5.7}/>
 <mesh position={[0,.035,-1]} rotation={[-Math.PI/2,0,0]} receiveShadow><circleGeometry args={[2.1,24]}/><meshStandardMaterial color="#43543a" roughness={1}/></mesh>
 <Clearing at={[13,11]} radius={3}/><Clearing at={[28,-1]} radius={2.8}/>
 {trees.map(([x,z,s,kind],i)=><Model key={'t'+i} name={kind?'MapleTree_1':'BirchTree_1'} position={[x,0,z]} scale={s} rotation={i*1.8} shadow={Math.abs(x)<25&&Math.abs(z)<34}/>)}
 {undergrowth.map(([x,z],i)=><Model key={'g'+i} name={i%7===0?'Bush_Small':'Grass_Small'} position={[x,0,z]} scale={i%7===0?.35:.7+(i%3)*.15} rotation={i*2.4} shadow={false}/>)}
 {fenceLines.map((f,i)=><Fence key={i} {...f}/>)}
 {hedges.map((h,i)=>{const alongX=h.s[0]>h.s[2],length=alongX?h.s[0]:h.s[2],count=Math.ceil(length/2.5);return <group key={'hedge'+i}>
  {Array.from({length:count},(_,j)=><mesh key={j} position={[h.p[0]+(alongX?-length/2+(j+.5)*length/count:0),h.p[1]-.15,h.p[2]+(alongX?0:-length/2+(j+.5)*length/count)]} scale={alongX?[1.9,h.s[1]*.6,1.2]:[1.2,h.s[1]*.6,1.9]} castShadow receiveShadow><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color={j%3===0?'#304b32':'#35543a'} roughness={1}/></mesh>)}
 </group>;})}
 {cottages.map((c,i)=><ClosedCottage key={'home'+i} cottage={c}/>)}
 {buildings.map(b=><group key={b.id} position={[b.at[0],0,b.at[1]]} rotation={[0,b.rotation,0]}><EntranceApron/><Shell building={b}/><Furnishings id={b.id}/></group>)}
 <Bench position={[-1.8,0,-1]} rotation={Math.PI/2} length={2.2}/><Bench position={[1.8,0,-1]} rotation={Math.PI/2} length={2.2}/>
 <FutureClearing/>
 <GardenGate open={gateOpen} count={discoveryCount}/>
 <Box p={[6,.9,19]} s={[.15,1.8,.15]}/><Sign title="WELCOME, TRAVELER" subtitle="E · Read the welcome sign" position={[6,1.8,19]} width={2.8}/>
 <Sign title="THE OLD-TREE SQUARE" subtitle="Learning & work ←    Projects →" position={[0,1.9,.1]} width={2.8}/>
 </>;}
