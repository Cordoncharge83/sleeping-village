import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {Box,Model,Sign,Table} from './SceneObjects';
import {workshopLayout,type Vec3} from './village';

type NoteKind='maintenance'|'research'|'wake';
function Notes({kind,position,rotation=0,poster=false}:{kind:NoteKind;position:Vec3;rotation?:number;poster?:boolean}){
 const texture=useMemo(()=>{
  const c=document.createElement('canvas');c.width=800;c.height=poster?1000:560;const g=c.getContext('2d')!;
  g.fillStyle='#e4d1a5';g.fillRect(0,0,c.width,c.height);
  g.strokeStyle='#ac8755';g.lineWidth=3;g.strokeRect(22,22,756,c.height-44);
  g.textAlign='center';g.fillStyle='#583f2e';
  if(poster){
   g.fillStyle='#38514b';g.fillRect(40,40,720,270);g.fillStyle='#f2dfb3';
   g.font='bold 125px Georgia';g.fillText('WAKE',400,205);g.font='34px Georgia';g.fillText('IMT ATLANTIQUE · 2023',400,270);
   g.fillStyle='#7c493b';g.font='46px Georgia';g.fillText('An event, together.',400,415);
   g.strokeStyle='#ad8454';g.lineWidth=4;
   for(let i=0;i<5;i++){g.beginPath();g.arc(400,540,50+i*21,Math.PI*.1,Math.PI*.9);g.stroke();}
   g.fillStyle='#583f2e';g.font='38px Georgia';g.fillText('20 organisers',400,735);g.fillText('Up to 500 guests',400,800);
   g.font='29px Georgia';g.fillText('Partnerships · Communication',400,912);
  }else{
   g.fillStyle='#b79b6e';g.fillRect(392,24,16,512);
   const titles={maintenance:['ARPEGE','CHANGE NOTES'],research:['DOCUMENTS','FIND AN ANSWER'],wake:['WAKE 2023','TEAM PLANNER']}[kind];
   g.fillStyle='#644734';g.font='bold 31px Georgia';g.fillText(titles[0],207,90,338);g.fillText(titles[1],596,90,340);
   const lines={maintenance:['Trace the incident','Read the rules','Verify the change'],research:['Collect & index','Retrieve & rank','Read the sources'],wake:['Listen to the team','Share the tasks','Support each other']}[kind];
   g.font='23px Georgia';lines.forEach((line,i)=>{g.textAlign='left';g.fillText(line,442,180+i*91,303);g.strokeStyle='#aa9067';g.strokeRect(442,202+i*91,18,18);g.beginPath();g.moveTo(480,214+i*91);g.lineTo(727,214+i*91);g.stroke();});
   g.strokeStyle='#527064';g.lineWidth=4;
   for(let i=0;i<3;i++){g.strokeRect(95,145+i*110,225,65);if(i<2){g.beginPath();g.moveTo(207,210+i*110);g.lineTo(207,255+i*110);g.stroke();}}
   g.textAlign='center';g.fillStyle='#527064';g.font='23px Georgia';
   (kind==='research'?['Sources','Search','Answer']:kind==='wake'?['People','Ideas','Together']:['Observe','Repair','Test']).forEach((label,i)=>g.fillText(label,207,185+i*110));
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
 },[kind,poster]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <group position={position} rotation={[0,rotation,0]}>
  {poster?<>
   <Box p={[0,0,-.035]} s={[1.42,1.77,.065]} color="#554333"/>
   <mesh position={[0,0,.002]}><planeGeometry args={[1.35,1.69]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>
  </>:<>
   <Box p={[0,-.025,0]} s={[.94,.055,.68]} color={kind==='wake'?'#874f3c':'#3c5148'}/>
   <Box p={[0,.013,0]} s={[.89,.035,.63]} color="#d6c295"/>
   <mesh position={[0,.032,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.88,.62]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>
   <Box p={[.23,.038,.28]} s={[.04,.009,.19]} color="#a0523b"/>
  </>}
 </group>;
}
export function Workshop(){
 const {bench,research,planning,anvil,barrel}=workshopLayout;
 return <>
  <Box p={[0,.094,.65]} s={[1.25,.012,3.65]} color="#3a5148"/>
  {[-.57,.57].map(x=><Box key={x} p={[x,.102,.65]} s={[.025,.008,3.5]} color="#aa8e59"/>)}
  <Model name="Workbench" position={[bench.p[0],.09,bench.p[2]]}/>
  <Notes kind="maintenance" position={[-.25,1.015,-1.55]}/>
  <Model name="Book_Stack_1" position={[.69,.99,-1.95]} scale={.65} rotation={.15}/>
  <Sign title="SOPRA STERIA" subtitle="ARPEGE · Maintain & improve" position={[0,2.35,-2.76]} width={2.7}/>
  <Model name="Shelf_Simple" position={[0,1.55,-2.85]} scale={.85}/>
  <Model name="Book_Stack_1" position={[-.3,1.65,-2.65]} scale={.65}/>
  <Model name="Anvil_Log" position={[anvil.p[0],.09,anvil.p[2]]} scale={.9} rotation={.35}/>
  <Model name="Barrel" position={[barrel.p[0],.09,barrel.p[2]]}/>
  <Table position={[research.p[0],.09,research.p[2]]} scale={[research.s[0],1,research.s[2]]}/>
  <Notes kind="research" position={[-1.96,1.145,.45]} rotation={Math.PI/2}/>
  <Model name="Book_Stack_1" position={[-2.1,1.115,-.18]} scale={.6} rotation={.2}/>
  <Sign title="LA BANQUE POSTALE" subtitle="Documents into answers" position={[-2.76,2.3,.45]} width={2.1} rotation={Math.PI/2}/>
  <Table position={[planning.p[0],.09,planning.p[2]]} scale={[planning.s[0],1,planning.s[2]]}/>
  <Notes kind="wake" position={[1.95,1.145,1.35]} rotation={-Math.PI/2}/>
  <Notes kind="wake" position={[2.78,2.1,1.35]} rotation={-Math.PI/2} poster/>
  <Box p={[2.23,1.115,.92]} s={[.38,.018,.24]} color="#d8c59a" rotation={.18}/>
  <Box p={[2.18,1.13,.95]} s={[.35,.012,.23]} color="#e8d8b4" rotation={-.1}/>
  <Model name="Lantern_Wall" position={[-2.68,1.1,1.8]} scale={.5} rotation={Math.PI/2}/>
  <pointLight position={[-1.7,2,1.3]} color="#ffbd79" intensity={7} distance={5} decay={2}/>
 </>;
}
