import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {Bench,Box,Model,Table} from './SceneObjects';
import {schoolhouseLayout,type Vec3} from './village';

function LearningPage({kind,position,rotation=0}:{kind:'education'|'skills'|'ledger';position:Vec3;rotation?:number}){
 const texture=useMemo(()=>{
  const c=document.createElement('canvas');c.width=1024;c.height=640;const g=c.getContext('2d')!;
  const book=kind==='ledger';
  g.fillStyle=book?'#e3d3ad':'#293e3a';g.fillRect(0,0,1024,640);
  g.strokeStyle=book?'#b79e75':'#a6b7a1';g.lineWidth=2;g.strokeRect(24,24,976,592);
  g.fillStyle=book?'#554230':'#eee4c7';g.textAlign='center';
  if(kind==='education'){
   g.font='48px Georgia';g.fillText('A FOUNDATION FOR MAKING',512,105);
   g.font='36px Georgia';g.fillText('IMT Atlantique · Nantes',512,190);
   g.font='28px Georgia';g.fillText('Software engineering · Class of 2025',512,245);
   const words=['LEARN','EXPERIMENT','BUILD'];
   words.forEach((word,i)=>{const x=74+i*308;g.strokeRect(x,335,260,95);g.font='27px Georgia';g.fillText(word,x+130,392);if(i<2){g.beginPath();g.moveTo(x+266,380);g.lineTo(x+300,380);g.stroke();}});
   g.font='italic 31px Georgia';g.fillText('Ideas become clearer when you put them to work.',512,545);
  }else if(kind==='skills'){
   g.font='48px Georgia';g.fillText('WHAT I WORK WITH',512,104);
   g.textAlign='left';g.font='29px Georgia';
   const rows=[['BACKENDS','Java · Python'],['INTERFACES','React · TypeScript'],['DATA & AI','PostgreSQL · Retrieval'],['INTERACTIVE','Unity · Three.js']];
   rows.forEach(([label,value],i)=>{const y=200+i*100;g.fillStyle='#c7ba8b';g.fillText(label,70,y);g.fillStyle='#eee4c7';g.fillText(value,425,y);g.beginPath();g.moveTo(70,y+26);g.lineTo(955,y+26);g.stroke();});
  }else{
   g.fillStyle='#c4ad83';g.fillRect(502,24,20,592);g.fillStyle='#554230';
   g.font='40px Georgia';g.fillText('STUDY NOTES',265,100);g.fillText('NANTES',760,100);
   g.font='28px Georgia';g.fillText('Read. Question. Try.',265,175);g.fillText('IMT Atlantique',760,175);g.fillText('Software engineering',760,230);g.fillText('2025',760,285);
   g.strokeStyle='#a58e66';for(let i=0;i<7;i++){g.beginPath();g.moveTo(85,245+i*38);g.lineTo(438-(i%3)*35,245+i*38);g.stroke();}
   g.font='italic 25px Georgia';g.fillText('A few pages for',760,410);g.fillText('what comes next.',760,448);
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
 },[kind]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 const width=kind==='education'?2.9:kind==='skills'?2.1:1.05,height=width*.625;
 return <group position={position} rotation={[0,rotation,0]}>
  {kind==='ledger'?<group rotation={[-Math.PI/2,0,0]}>
   <Box p={[0,0,-.035]} s={[width+.08,height+.07,.075]} color="#695142"/>
   <Box p={[0,0,.005]} s={[width+.025,height+.025,.025]} color="#d3c29c"/>
   <mesh position={[0,0,.019]}><planeGeometry args={[width,height]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>
  </group>:<>
   <Box p={[0,0,-.04]} s={[width+.16,height+.16,.1]} color="#76573d"/>
   <mesh position={[0,0,.015]}><planeGeometry args={[width,height]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>
   <Box p={[0,-height/2-.07,.09]} s={[width+.16,.07,.24]} color="#a07c54"/>
   <Box p={[width*.24,-height/2-.021,.1]} s={[.16,.025,.035]} color="#e4dcc6"/>
  </>}
 </group>;
}
function Bookcase(){
 const {p,s}=schoolhouseLayout.bookcase;
 return <group position={[p[0],.09,p[2]]} rotation={[0,Math.PI/2,0]}>
  <Box p={[0,1.16,-.27]} s={[s[2],2.32,.08]} color="#4a382c"/>
  {[-1,1].map(side=><Box key={side} p={[side*(s[2]/2-.055),1.16,0]} s={[.11,2.32,s[0]]} color="#76583f"/>)}
  {[.08,.78,1.48,2.25].map(y=><Box key={y} p={[0,y,0]} s={[s[2],.1,s[0]]} color="#94704c"/>)}
  {[0,1,2].flatMap(row=>Array.from({length:7},(_,i)=>{
   const height=.36+(i%3)*.065,x=-.81+i*.245,y=.18+row*.7+height/2;
   return <group key={`${row}-${i}`}>
    <Box p={[x,y,.02]} s={[.17,height,.38]} color={['#596451','#7c5142','#b09965','#4e616c'][(i+row)%4]}/>
    <Box p={[x,y-height*.25,.215]} s={[.125,.018,.006]} color="#c9b57c"/>
    <Box p={[x,y+height*.25,.215]} s={[.125,.018,.006]} color="#c9b57c"/>
   </group>;
  }))}
 </group>;
}
export function Schoolhouse(){
 const {desk,skills,bench}=schoolhouseLayout;
 return <>
  <Box p={[0,.094,.8]} s={[1.35,.012,3.3]} color="#4c5d64"/>
  {[-.61,.61].map(x=><Box key={x} p={[x,.102,.8]} s={[.025,.008,3.15]} color="#c1a673"/>)}
  <LearningPage kind="education" position={[0,2.1,-2.76]}/>
  <Table position={[desk.p[0],.09,desk.p[2]]} scale={[desk.s[0],1,desk.s[2]]}/>
  <LearningPage kind="ledger" position={[-.15,1.16,-1.42]}/>
  <Model name="Book_Stack_1" position={[.76,1.12,-1.9]} scale={.7} rotation={.12}/>
  <Box p={[-.82,1.16,-1.75]} s={[.13,.1,.13]} color="#343d3d"/>
  <Box p={[-.64,1.125,-1.65]} s={[.025,.025,.32]} color="#b69461" rotation={-.35}/>
  <Bookcase/>
  <Bench position={[bench.p[0],.09,bench.p[2]]} length={bench.s[2]} rotation={Math.PI/2}/>
  <Box p={[-2.25,.665,1.58]} s={[.42,.04,.55]} color="#586c70"/>
  <Model name="Book_Stack_1" position={[-2.25,.66,.9]} scale={.55} rotation={.3}/>
  <Table position={[skills.p[0],.09,skills.p[2]]} scale={[skills.s[0],1,skills.s[2]]}/>
  <LearningPage kind="skills" position={[2.76,2.2,.45]} rotation={-Math.PI/2}/>
  <Box p={[2,1.13,.5]} s={[.8,.025,1.15]} color="#d9c59c"/>
  {/* Wooden pieces make a small connected system on the practice table. */}
  {[-.3,.3].flatMap(z=>[-.2,.2].map(x=><Box key={`${x}-${z}`} p={[2+x,1.2,.5+z]} s={[.19,.12,.22]} color={z<0?'#526d68':'#9a7049'}/>))}
  <Box p={[2,1.15,.5]} s={[.035,.012,.6]} color="#866646"/>
  {[-.3,.3].map(z=><Box key={z} p={[2,1.15,.5+z]} s={[.4,.012,.035]} color="#866646"/>)}
  <Model name="Book_Stack_1" position={[2.13,1.12,-.2]} scale={.6}/>
  <Model name="Lantern_Wall" position={[-2.68,1.25,2.2]} scale={.45} rotation={Math.PI/2}/>
  <pointLight position={[-1.6,2,1.35]} color="#ffcb91" intensity={7} distance={5} decay={2}/>
 </>;
}
