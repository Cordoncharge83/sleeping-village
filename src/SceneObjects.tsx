import {useEffect,useMemo} from 'react';
import {useLoader} from '@react-three/fiber';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import assets from './assets.json';
import {publicAssetUrl} from './public-asset';
import {woodlandMaterial} from './atmosphere';
import type {Vec3} from './village';

type Asset=keyof typeof assets;
export function Model({name,position=[0,0,0],rotation=0,scale=1,shadow=true}:{name:Asset;position?:Vec3;rotation?:number;scale?:number|Vec3;shadow?:boolean}){
 const gltf=useLoader(GLTFLoader,publicAssetUrl(assets[name]));
 const object=useMemo(()=>{const o=gltf.scene.clone(true);o.traverse(n=>{if(n instanceof THREE.Mesh){n.castShadow=shadow;n.receiveShadow=true;n.material=Array.isArray(n.material)?n.material.map(woodlandMaterial):woodlandMaterial(n.material);}});return o;},[gltf,shadow]);
 // The loader cache owns shared source geometries and materials.
 return <primitive object={object} position={position} rotation={[0,rotation,0]} scale={scale} dispose={null}/>;
}
export function Box({p,s,color='#584130',rotation=0}:{p:Vec3;s:Vec3;color?:string;rotation?:number}){
 return <mesh position={p} rotation={[0,rotation,0]} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={color} roughness={.95}/></mesh>;
}
export function Sign({title,subtitle,position,width=3,rotation=0,directions}:{title:string;subtitle:string;position:Vec3;width?:number;rotation?:number;directions?:{left:string;right:string}}){
 const texture=useMemo(()=>{
  const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;
  ctx.fillStyle='#34483a';ctx.fillRect(0,0,1024,256);
  ctx.strokeStyle='#c5aa73';ctx.lineWidth=3;ctx.strokeRect(12,12,1000,232);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff3d2';
  ctx.font='500 54px Georgia';ctx.fillText(title,512,89,950);
  ctx.fillStyle='#e4ce9f';
  if(directions){
   ctx.font='bold 39px Arial';ctx.textAlign='left';ctx.fillText(directions.left,166,178,310);
   ctx.textAlign='right';ctx.fillText(directions.right,858,178,310);
   ctx.strokeStyle='#e4ce9f';ctx.lineWidth=8;ctx.lineCap='round';ctx.lineJoin='round';
   for(const [tip,tail,head] of [[65,137,91],[959,887,933]]){
    ctx.beginPath();ctx.moveTo(tail,178);ctx.lineTo(tip,178);ctx.lineTo(head,152);ctx.moveTo(tip,178);ctx.lineTo(head,204);ctx.stroke();
   }
   ctx.strokeStyle='#c5aa7377';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(512,146);ctx.lineTo(512,214);ctx.stroke();
  }else{ctx.font='32px Arial';ctx.fillText(subtitle,512,176,940);}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
 },[title,subtitle,directions?.left,directions?.right]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <group position={position} rotation={[0,rotation,0]}>
  <Box p={[0,0,0]} s={[width+.1,width/4+.08,.1]}/>
  <mesh position={[0,0,.056]}><planeGeometry args={[width,width/4]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>
 </group>;
}
export function Bench({position,rotation=0,length=2.5}:{position:Vec3;rotation?:number;length?:number}){
 return <group position={position} rotation={[0,rotation,0]}>
  <Box p={[0,.48,0]} s={[length,.14,.5]} color="#896247"/>
  {[-1,1].map(side=><Box key={side} p={[side*(length/2-.25),.23,0]} s={[.17,.46,.48]}/>)}
 </group>;
}
export function Table({position,scale=[1.4,1,1.4]}:{position:Vec3;scale?:Vec3}){
 return <group position={position} scale={scale}>
  <Box p={[0,.94,0]} s={[1,.16,1]} color="#96724e"/>
  {[-.34,.34].flatMap(x=>[-.34,.34].map(z=><Box key={x+':'+z} p={[x,.47,z]} s={[.12,.94,.12]}/>))}
 </group>;
}
