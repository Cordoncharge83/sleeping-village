import {useEffect,useMemo,useRef,type RefObject} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {buildings,localPoint,type PlaceId,type Vec3} from './village';

type Target={place:PlaceId;page:number;p:Vec3;s:Vec3;rotation:Vec3};
const targets:Target[]=[];
function display(place:PlaceId,page:number,p:Vec3,s:Vec3,yaw=0,tilt=0){
 const building=buildings.find(b=>b.id===place)!;
 const [x,z]=localPoint(building,p[0],p[2]);
 targets.push({place,page,p:[x,p[1],z],s,rotation:[tilt,building.rotation+yaw,0]});
}
display('smosh',0,[-1.55,1.17,.4],[1.22,.12,.84],0,.16);
display('bargainy',0,[0,1.28,-1.58],[1.27,.13,.85]);
display('atlas',0,[0,1.18,-1.55],[1.27,.13,.85]);
display('duel',0,[-.2,1.18,-1.45],[1.17,.13,.81]);
display('workshop',0,[-.25,1.03,-1.55],[.99,.12,.73]);
display('workshop',1,[-1.96,1.16,.45],[.99,.12,.73],Math.PI/2);
display('workshop',2,[1.95,1.16,1.35],[.99,.12,.73],-Math.PI/2);
display('education',0,[-.15,1.17,-1.42],[1.12,.12,.72]);
display('education',1,[2,1.21,.5],[.85,.19,1.2]);
// The same cue also marks the outdoor notices that can be inspected.
targets.push(
 {place:'welcome',page:0,p:[6,1.8,19],s:[2.94,.82,.13],rotation:[0,0,0]},
 {place:'square',page:0,p:[0,1.9,.1],s:[2.94,.82,.13],rotation:[0,0,0]},
 {place:'gate',page:0,p:[0,3.3,-16.75],s:[4.14,1.12,.13],rotation:[0,0,0]},
 {place:'future',page:0,p:[-3,1.2,-27.4],s:[2.74,.77,.13],rotation:[0,0,0]},
 {place:'future',page:0,p:[3.4,1.2,-27.7],s:[2.84,.795,.13],rotation:[0,0,0]},
);
function Highlight({target,near,page,active}:{target:Target;near:RefObject<PlaceId|null>;page:RefObject<number>;active:boolean}){
 const group=useRef<THREE.Group>(null),line=useRef<THREE.LineBasicMaterial>(null),wash=useRef<THREE.MeshBasicMaterial>(null);
 const geometry=useMemo(()=>{const box=new THREE.BoxGeometry(1,1,1);const edges=new THREE.EdgesGeometry(box);box.dispose();return edges;},[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 useFrame((_,delta)=>{
  if(!line.current||!wash.current||!group.current)return;
  const selected=active&&near.current===target.place&&page.current===target.page;
  line.current.opacity=THREE.MathUtils.damp(line.current.opacity,selected?.65:0,9,Math.min(delta,.06));
  wash.current.opacity=line.current.opacity*.075;
  group.current.visible=line.current.opacity>.005;
 });
 return <group ref={group} position={target.p} rotation={target.rotation} scale={target.s} visible={false}>
  <lineSegments geometry={geometry}><lineBasicMaterial ref={line} color="#ffdb7d" transparent opacity={0} depthWrite={false} toneMapped={false}/></lineSegments>
  <mesh><boxGeometry args={[1,1,1]}/><meshBasicMaterial ref={wash} color="#ffcf67" transparent opacity={0} depthWrite={false} toneMapped={false}/></mesh>
 </group>;
}
export function InspectHighlights(props:{near:RefObject<PlaceId|null>;page:RefObject<number>;active:boolean}){
 return <>{targets.map((target,i)=><Highlight key={i} target={target} {...props}/>)}</>;
}
