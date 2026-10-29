import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {Model,Box,Sign,Bench,Table} from './SceneObjects';
import {tavernLayout,type Vec3} from './village';
import {SmoshCouch} from './SmoshCouch';

function Mug({position,rotation=0}:{position:Vec3;rotation?:number}){return <group position={position} rotation={[0,rotation,0]}>
 <mesh castShadow><cylinderGeometry args={[.09,.07,.19,10]}/><meshStandardMaterial color="#b98659" roughness={.8}/></mesh>
 <mesh position={[0,.097,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.073,10]}/><meshStandardMaterial color="#46271b"/></mesh>
 <mesh position={[.1,.01,0]}><torusGeometry args={[.062,.018,5,10]}/><meshStandardMaterial color="#b98659" roughness={.8}/></mesh>
 </group>;}
function Candle({position}:{position:Vec3}){return <group position={position}>
 <mesh castShadow><cylinderGeometry args={[.12,.16,.04,10]}/><meshStandardMaterial color="#483527" metalness={.4} roughness={.5}/></mesh>
 <mesh position={[0,.13,0]} castShadow><cylinderGeometry args={[.046,.055,.24,8]}/><meshStandardMaterial color="#f1dcb0"/></mesh>
 <mesh position={[0,.29,0]} scale={[.7,1.5,.7]}><sphereGeometry args={[.035,8,6]}/><meshBasicMaterial color="#ffce79" toneMapped={false}/></mesh>
 </group>;}
function Ledger(){
 const texture=useMemo(()=>{
  const c=document.createElement('canvas');c.width=1024;c.height=640;const g=c.getContext('2d')!;
  g.fillStyle='#ead9ae';g.fillRect(0,0,1024,640);g.fillStyle='#d4bd8a';g.fillRect(500,0,24,640);
  g.strokeStyle='#b19663';g.lineWidth=3;g.strokeRect(26,26,460,588);g.strokeRect(538,26,460,588);
  g.fillStyle='#713c32';g.textAlign='center';g.font='bold 42px Georgia';g.fillText('STORY',256,126);g.fillText('& SUPPER',256,178);
  g.fillStyle='#4b4738';g.font='28px Georgia';g.fillText('Every story',256,292);g.fillText('has a place.',256,335);
  g.font='bold 34px Georgia';g.fillText('Smosh',762,133);g.fillText('Story Finder',762,180);
  g.font='23px Georgia';g.fillText('A familiar story. Found again.',762,258);
  g.strokeStyle='#b9a47c';for(let i=0;i<6;i++){g.beginPath();g.moveTo(590,330+i*31);g.lineTo(930-(i%3)*45,330+i*31);g.stroke();}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
 },[]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <group position={[-1.55,1.16,.4]} rotation={[.16,0,0]}>
  <Box p={[0,-.04,0]} s={[1.17,.075,.79]} color="#773e32"/>
  <Box p={[0,0,0]} s={[1.11,.065,.73]} color="#d9c89d"/>
  <mesh position={[0,.034,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[1.1,.72]}/><meshStandardMaterial map={texture} roughness={.95}/></mesh>
  <Box p={[.2,.039,.32]} s={[.065,.009,.3]} color="#944935"/>
 </group>;
}
export function Tavern(){return <>
 {/* Crimson, cream and mustard connect the room to the archive and its couch. */}
 <Box p={[0,.091,.3]} s={[1.65,.012,4.6]} color="#9d3047"/>
 {[-.76,.76].map(x=><Box key={x} p={[x,.1,.3]} s={[.035,.008,4.4]} color="#bc9459"/>)}
 <Box p={tavernLayout.counter.p} s={tavernLayout.counter.s} color="#6e4633"/>
 <Box p={[0,1.21,-2.12]} s={[4.9,.13,.94]} color="#a77b4f"/>
 {[-1.9,-.95,0,.95,1.9].map(x=><Box key={x} p={[x,.65,-1.675]} s={[.055,.94,.025]} color="#b18251"/>)}
 <Sign title="STORIES WORTH SHARING" subtitle="Take a seat. Find an old favourite." position={[0,2.48,-2.77]} width={3.8}/>
 {[-1.45,1.45].map((x,i)=><group key={x}>
  <Model name="Shelf_Simple" position={[x,1.75,-2.8]} scale={.85}/>
  <Model name="Book_Stack_1" position={[x-.15,1.85,-2.57]} scale={.75} rotation={i*.25}/>
  <Mug position={[x+.35,1.96,-2.57]}/>
 </group>)}
 <Mug position={[1.65,1.37,-2]}/><Mug position={[1.25,1.37,-2.2]} rotation={1.2}/><Candle position={[-1.9,1.3,-2.1]}/>
 <Table position={[-1.55,.09,.15]} scale={[1.5,1,1.65]}/><Ledger/>
 <Model name="Book_Stack_1" position={[-1.85,1.12,-.38]} scale={.65} rotation={.2}/><Candle position={[-1.05,1.12,-.3]}/>
 <Sign title="THE STORY LEDGER" subtitle="Smosh Story Finder" position={[-1.55,.77,1.01]} width={1.36}/>
 <SmoshCouch/>
 <Table position={[tavernLayout.supper.p[0],.09,tavernLayout.supper.p[2]]} scale={[.85,1,1.7]}/>
 <Mug position={[1.25,1.22,.55]} rotation={-.5}/><Mug position={[1.38,1.22,-.45]} rotation={2}/><Candle position={[1.28,1.12,.05]}/>
 <Model name="Barrel" position={[-2.38,.09,-1.45]} scale={.7}/>
 <Model name="Lantern_Wall" position={[-2.68,1.4,.3]} scale={.5} rotation={Math.PI/2}/>
 <pointLight position={[-1.7,2,.2]} color="#ffbb79" intensity={8} distance={5} decay={2}/>
 {/* Canvas awning and terrace benches frame a generous central approach. */}
 <group position={[0,3.13,3.78]} rotation={[.12,0,0]}>
  <Box p={[0,0,0]} s={[5.7,.055,1.65]} color="#a2384c"/>
  {[-2,-1,0,1,2].map(x=><Box key={x} p={[x,.031,0]} s={[.05,.008,1.65]} color="#c39a62"/>)}
 </group>
 <Box p={[0,2.99,4.58]} s={[5.7,.25,.055]} color="#a2384c"/>
 {[-1,1].map(x=><Box key={x} p={[x,3.3,4.59]} s={[.075,.6,.075]}/>)}
 <Bench position={[-2.1,.08,4.7]} rotation={Math.PI/2}/><Bench position={[2.1,.08,4.7]} rotation={Math.PI/2}/>
 {[-2.55,2.55].map(x=><group key={x}>
  <Box p={[x,.24,3.5]} s={[.7,.48,.65]} color="#71533c"/>
  <Model name="Bush_Small" position={[x,.37,3.5]} scale={.23}/>
 </group>)}
 </>;}
