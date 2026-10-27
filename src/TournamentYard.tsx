import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {Bench,Box,Model,Sign,Table} from './SceneObjects';
import {tournamentLayout} from './village';

function TournamentPaper({board=false}:{board?:boolean}){
 const texture=useMemo(()=>{
  const c=document.createElement('canvas');c.width=1024;c.height=640;const g=c.getContext('2d')!;
  g.fillStyle=board?'#293d49':'#e5d5af';g.fillRect(0,0,1024,640);
  g.strokeStyle=board?'#bca372':'#a58c61';g.lineWidth=3;g.strokeRect(24,24,976,592);
  g.textAlign='center';g.fillStyle=board?'#eee0b9':'#4d493a';
  if(board){
   g.font='bold 52px Georgia';g.fillText('TOP CUT',512,98);
   g.font='26px Georgia';g.fillText('Every match moves the event forward.',512,145);
   // An illustrative eight-seed bracket decorates the yard, not a product screenshot.
   const ys=Array.from({length:8},(_,i)=>204+i*49);
   g.font='22px Georgia';
   ys.forEach((y,i)=>{g.strokeRect(75,y,180,32);g.fillText(`Seed ${i+1}`,165,y+24);});
   const levels=[ys.map(y=>y+16)];
   for(let level=0;level<3;level++){
    const next:number[]=[],from=255+level*225,to=from+225;
    for(let i=0;i<levels[level].length;i+=2){
     const a=levels[level][i],b=levels[level][i+1],mid=(a+b)/2;
     g.beginPath();g.moveTo(from,a);g.lineTo(from+75,a);g.lineTo(from+75,b);g.lineTo(from,b);g.moveTo(from+75,mid);g.lineTo(to,mid);g.stroke();next.push(mid);
    }
    levels.push(next);
   }
   g.font='21px Georgia';g.fillText('FINAL',875,370);
  }else{
   g.fillStyle='#c6ae81';g.fillRect(501,25,22,590);g.fillStyle='#4d493a';
   g.font='bold 42px Georgia';g.fillText('DUELSYNC',260,112);g.fillText('NEXT ROUND',766,112);
   g.font='29px Georgia';g.fillText('At the organiser’s table',260,190);
   ['Pairings','Standings','Top Cut'].forEach((line,i)=>g.fillText(line,766,235+i*105));
   g.font='italic 27px Georgia';g.fillText('Keep the event moving.',260,500);
   for(let i=0;i<5;i++){g.beginPath();g.moveTo(80,270+i*33);g.lineTo(445-(i%2)*45,270+i*33);g.stroke();}
   [260,365,470].forEach(y=>{g.beginPath();g.moveTo(587,y);g.lineTo(944,y);g.stroke();});
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
 },[board]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 if(board)return <group position={[0,1.95,-2.72]}>
  <Box p={[0,0,-.035]} s={[3.2,1.98,.08]} color="#927148"/>
  <mesh position={[0,0,.01]}><planeGeometry args={[3.08,1.86]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>
 </group>;
 return <group position={[-.2,1.16,-1.45]}>
  <Box p={[0,-.025,0]} s={[1.12,.065,.76]} color="#405769"/>
  <Box p={[0,.02,0]} s={[1.06,.03,.7]} color="#d1bf96"/>
  <mesh position={[0,.037,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[1.05,.69]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>
  <Box p={[.24,.044,.32]} s={[.05,.009,.22]} color="#a78951"/>
 </group>;
}
function Trophy(){return <group position={[.75,1.12,-1.84]}>
 <Box p={[0,.04,0]} s={[.29,.08,.25]} color="#574634"/>
 <mesh position={[0,.18,0]} castShadow><cylinderGeometry args={[.045,.085,.22,10]}/><meshStandardMaterial color="#bc9b55" metalness={.5} roughness={.45}/></mesh>
 <mesh position={[0,.38,0]} castShadow><cylinderGeometry args={[.17,.06,.22,10]}/><meshStandardMaterial color="#c3a464" metalness={.5} roughness={.45}/></mesh>
 <mesh position={[0,.492,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.145,10]}/><meshStandardMaterial color="#78613b" roughness={.7}/></mesh>
 {[-.17,.17].map(x=><mesh key={x} position={[x,.38,0]} castShadow><torusGeometry args={[.075,.018,5,12]}/><meshStandardMaterial color="#bc9b55" metalness={.5} roughness={.45}/></mesh>)}
 </group>;}
export function TournamentYard(){
 const {desk}=tournamentLayout;
 return <>
  <Box p={[0,1.4,-2.85]} s={[3.5,2.8,.2]} color="#534837"/>
  <TournamentPaper board/>
  <Box p={[0,.094,.8]} s={[1.15,.012,3.8]} color="#3e5362"/>
  {[-.51,.51].map(x=><Box key={x} p={[x,.102,.8]} s={[.025,.008,3.65]} color="#b69b65"/>)}
  <Table position={[desk.p[0],.09,desk.p[2]]} scale={[desk.s[0],1,desk.s[2]]}/>
  <TournamentPaper/><Trophy/>
  <Sign title="THE ORGANISER’S TABLE" subtitle="DuelSync" position={[0,.73,-1.105]} width={1.6}/>
  {[-1,1].map((side,i)=>{
   const table=tournamentLayout[side<0?'leftTable':'rightTable'],seat=tournamentLayout[side<0?'leftSeat':'rightSeat'];
   return <group key={side}>
    <Table position={[table.p[0],.09,table.p[2]]} scale={[table.s[0],1,table.s[2]]}/>
    <Box p={[table.p[0],1.12,.65]} s={[1.04,.018,1.48]} color={side<0?'#3c5864':'#58674d'}/>
    <Box p={[table.p[0],1.133,.65]} s={[.98,.008,.025]} color="#c4aa77"/>
    {[-1,1].flatMap(player=>[-.29,0,.29].map((x,index)=><group key={`${player}-${x}`}>
     <Box p={[table.p[0]+x,1.14,.65+player*.35]} s={[.21,.012,.3]} color="#d2bf91"/>
     <Box p={[table.p[0]+x,1.149,.65+player*.35]} s={[.17,.006,.26]} color={index===1?'#98714f':'#536674'}/>
    </group>))}
    <Box p={[table.p[0]+.32,1.17,.08]} s={[.2,.08,.27]} color="#815c47"/>
    <Sign title={`TABLE 0${i+1}`} subtitle="Ready for the next round" position={[table.p[0],.77,1.49]} width={.92}/>
    <Bench position={[seat.p[0],.09,seat.p[2]]} length={seat.s[2]} rotation={Math.PI/2}/>
   </group>;
  })}
  <Model name="Lantern_Wall" position={[-2.65,1.4,2.85]} scale={.45} rotation={Math.PI}/>
  <pointLight position={[-1.6,2,1.4]} color="#ffca91" intensity={6} distance={5} decay={2}/>
 </>;
}
