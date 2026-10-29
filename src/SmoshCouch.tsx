import {useEffect,useMemo} from 'react';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {Box} from './SceneObjects';
import {tavernLayout,type Vec3} from './village';

function Upholstery({p,s,color,rotation=[0,0,0]}:{p:Vec3;s:Vec3;color:string;rotation?:Vec3}){
 const geometry=useMemo(()=>new RoundedBoxGeometry(s[0],s[1],s[2],1,.055),[s[0],s[1],s[2]]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh position={p} rotation={rotation} castShadow receiveShadow>
  <primitive object={geometry} attach="geometry"/>
  <meshStandardMaterial color={color} roughness={1}/>
 </mesh>;
}

// Cream upholstery and patterned mustard pillows echo the Reddit Stories couch.
export function SmoshCouch(){return <group position={[tavernLayout.seat.p[0],.09,tavernLayout.seat.p[2]]} rotation={[0,-Math.PI/2,0]}>
 {[-1.08,1.08].flatMap(x=>[-.28,.28].map(z=><Box key={`${x}:${z}`} p={[x,.12,z]} s={[.13,.24,.13]} color="#765038"/>))}
 <Upholstery p={[0,.34,0]} s={[2.65,.33,.84]} color="#cbbb9e"/>
 {[-.82,0,.82].map(x=><group key={x}>
  <Upholstery p={[x,.61,.035]} s={[.79,.23,.7]} color="#e9dec8"/>
  <Upholstery p={[x,.97,-.32]} s={[.8,.64,.23]} color="#e4d7be" rotation={[-.08,0,0]}/>
 </group>)}
 {[-1.23,1.23].map(x=><Upholstery key={x} p={[x,.72,0]} s={[.23,.7,.9]} color="#e4d7be"/>)}
 {[-1,1].map(side=><group key={side} position={[side*.86,.98,.08]} rotation={[-.15,0,side*.16]}>
  <Upholstery p={[0,0,0]} s={[.4,.44,.16]} color={side<0?'#d5a046':'#f1e6cf'}/>
  {[-.1,0,.1].map(x=><group key={x} position={[x,0,.088]}>
   <Box p={[-.023,.07,0]} s={[.035,.17,.012]} rotation={0} color={side<0?'#f3e9d2':'#c49a4d'}/>
   <group rotation={[0,0,Math.PI/4]}><Box p={[.025,-.055,0]} s={[.035,.18,.012]} color={side<0?'#f3e9d2':'#c49a4d'}/></group>
  </group>)}
 </group>)}
</group>;}
