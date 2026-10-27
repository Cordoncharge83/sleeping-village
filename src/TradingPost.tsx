import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {Box,Model,Sign} from './SceneObjects';
import {tradingPostLayout,type Vec3} from './village';

function Notebook(){
 const texture=useMemo(()=>{
  const c=document.createElement('canvas');c.width=1024;c.height=640;const g=c.getContext('2d')!;
  g.fillStyle='#e5d3ad';g.fillRect(0,0,1024,640);g.fillStyle='#c9ad7c';g.fillRect(503,0,18,640);
  g.strokeStyle='#b39366';g.lineWidth=2;g.strokeRect(28,28,455,584);g.strokeRect(541,28,455,584);
  g.textAlign='center';g.fillStyle='#804f3c';g.font='bold 43px Georgia';g.fillText('BARGAINY',256,120);g.fillText('THE DEBRIEF',768,120);
  g.fillStyle='#4c4539';g.font='30px Georgia';g.fillText('Make an offer.',256,233);g.fillText('Hear a counteroffer.',256,291);g.fillText('Try again.',256,349);
  g.font='27px Georgia';['What worked','Try differently','Words to borrow'].forEach((line,i)=>{g.fillText(line,768,224+i*105);g.beginPath();g.moveTo(596,249+i*105);g.lineTo(940,249+i*105);g.stroke();});
  g.font='italic 25px Georgia';g.fillText('Practise the conversation.',256,526);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
 },[]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <group position={[0,1.245,-1.58]}>
  <Box p={[0,0,0]} s={[1.22,.065,.8]} color="#a45e46"/>
  <Box p={[0,.04,0]} s={[1.16,.04,.74]} color="#d2bd94"/>
  <mesh position={[0,.062,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[1.15,.73]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>
  <Box p={[.24,.069,.34]} s={[.055,.009,.26]} color="#a75b43"/>
 </group>;
}
function Parcel({position,scale=1,color='#bfa078'}:{position:Vec3;scale?:number;color?:string}){return <group position={position} scale={scale}>
 <Box p={[0,.16,0]} s={[.5,.32,.4]} color={color}/>
 <Box p={[0,.325,0]} s={[.045,.012,.405]} color="#dac59b"/>
 <Box p={[0,.325,0]} s={[.505,.012,.045]} color="#dac59b"/>
 <Box p={[0,.16,.205]} s={[.045,.32,.012]} color="#dac59b"/>
 </group>;}
function Jar({position,color='#a36a4c'}:{position:Vec3;color?:string}){return <group position={position}>
 <mesh position={[0,.17,0]} castShadow><cylinderGeometry args={[.13,.15,.34,10]}/><meshStandardMaterial color={color} roughness={.9}/></mesh>
 <mesh position={[0,.355,0]} castShadow><cylinderGeometry args={[.145,.145,.035,10]}/><meshStandardMaterial color="#71583d" roughness={1}/></mesh>
 </group>;}
function Scales(){return <group position={[-1.2,1.225,-1.88]}>
 <Box p={[0,.035,0]} s={[.4,.07,.3]} color="#5a4932"/>
 <Box p={[0,.36,0]} s={[.045,.65,.045]} color="#b2955c"/>
 <Box p={[0,.66,0]} s={[.85,.045,.045]} color="#b2955c"/>
 {[-1,1].map(side=><group key={side} position={[side*.35,0,0]}>
  {[-1,1].map(edge=><Box key={edge} p={[edge*.11,.49,0]} s={[.012,.31,.012]} color="#c9b378"/>)}
  <mesh position={[0,.32,0]} castShadow><cylinderGeometry args={[.18,.12,.045,12]}/><meshStandardMaterial color="#b2955c" metalness={.35} roughness={.65}/></mesh>
  <Box p={[0,.39,0]} s={[.1,.09,.1]} color={side===1?'#9c7655':'#5b7163'}/>
 </group>)}
 </group>;}
function GoodsShelf(){
 const {p,s}=tradingPostLayout.goods;
 return <group position={[p[0],.09,p[2]]} rotation={[0,Math.PI/2,0]}>
  <Box p={[0,.96,-.29]} s={[s[2],1.92,.07]} color="#594431"/>
  {[-1,1].map(side=><Box key={side} p={[side*(s[2]/2-.055),.96,0]} s={[.11,1.92,s[0]]} color="#77583e"/>)}
  {[.08,.68,1.28,1.87].map(y=><Box key={y} p={[0,y,0]} s={[s[2],.1,s[0]]} color="#98724d"/>)}
  {[-.63,-.21,.21,.63].map((x,i)=><Jar key={x} position={[x,.73,0]} color={['#a36a4c','#738168','#bd9a66','#647777'][i]}/>)}
  <Parcel position={[-.48,.13,.01]} scale={1.2}/><Parcel position={[.43,.13,.01]} scale={1.15} color="#8d8d6c"/>
  {[-.56,0,.56].map((x,i)=><group key={x}>
   <Box p={[x,1.42,0]} s={[.43,.18,.42]} color={['#7c5350','#697a73','#c3a278'][i]}/>
   <Box p={[x,1.6,0]} s={[.4,.16,.4]} color={['#a97d62','#a3a282','#7b8d8d'][i]}/>
  </group>)}
 </group>;
}
export function TradingPost(){
 const {counter,barrel,crates}=tradingPostLayout;
 return <>
  <Box p={[0,.094,.8]} s={[1.65,.012,3.8]} color="#88513d"/>
  {[-.74,.74].map(x=><Box key={x} p={[x,.102,.8]} s={[.04,.008,3.65]} color="#c5a56b"/>)}
  <Box p={counter.p} s={counter.s} color="#77503a"/>
  <Box p={[0,1.155,-1.85]} s={[3.6,.13,.95]} color="#b18658"/>
  {[-1.4,-.7,0,.7,1.4].map(x=><Box key={x} p={[x,.63,-1.369]} s={[.045,.94,.02]} color="#b08756"/>)}
  <Box p={[0,.21,-1.36]} s={[3.5,.06,.04]} color="#c19a61"/>
  <Notebook/><Scales/><Parcel position={[1.14,1.225,-1.83]} scale={.85}/>
  <Sign title="LET’S MAKE A DEAL" subtitle="Bargainy · Practise, reflect, try again" position={[0,2.34,-2.76]} width={3.1}/>
  <Model name="Shelf_Simple" position={[0,1.55,-2.82]} scale={.8}/>
  <Model name="Book_Stack_1" position={[-.3,1.65,-2.62]} scale={.6}/><Jar position={[.4,1.65,-2.62]} color="#7c8d79"/>
  <GoodsShelf/>
  <Model name="Barrel" position={[barrel.p[0],.09,barrel.p[2]]}/>
  <Model name="Crate_Wooden" position={[crates.p[0],.09,crates.p[2]]} scale={.75}/>
  <Parcel position={[2.18,.82,.15]} scale={.8}/>
  <Sign title="ROOM TO NEGOTIATE" subtitle="A first offer is a beginning." position={[2.76,2.1,.1]} rotation={-Math.PI/2} width={2.1}/>
  <Model name="Lantern_Wall" position={[-2.68,1.3,2.15]} scale={.45} rotation={Math.PI/2}/>
  <pointLight position={[-1.4,2,1.2]} color="#ffbf88" intensity={7} distance={5} decay={2}/>
 </>;
}
