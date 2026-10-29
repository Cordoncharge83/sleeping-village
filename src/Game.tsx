import {Suspense,useEffect,useMemo,useRef} from 'react';
import {Canvas,useFrame,useLoader,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import assets from './assets.json';
import {publicAssetUrl} from './public-asset';
import {createSimulation,type Simulation} from './physics';
import {InspectHighlights} from './InspectHighlights';
import {VillageScene} from './VillageScene';
import {SPAWN,nearbyPlace,workshopStationAt,schoolhouseStationAt,currentArea,type PlaceId} from './village';
import {WALK_SPEED,RUN_SPEED} from './tuning';
import {FollowCamera,InterpolatedPosition,PHYSICS_STEP} from './player-view';
import {atmosphere} from './atmosphere';
import type {VillageAudio} from './audio';
import type {Gait} from './footsteps';

type Props={active:boolean;overview:boolean;sensitivity:number;low:boolean;reset:number;gateOpen:boolean;discoveryCount:number;audio:VillageAudio;onNear:(near:PlaceId|null,page:number)=>void;onArea:(area:PlaceId|'arrival')=>void;onReady:()=>void;onError:(message:string)=>void};
function World(props:Props){
 const gltf=useLoader(GLTFLoader,publicAssetUrl(assets.Traveler));
 const traveler=useMemo(()=>{const o=clone(gltf.scene);o.traverse(n=>{if(n instanceof THREE.Mesh){n.castShadow=true;n.receiveShadow=true;}});return o;},[gltf]);
 const actor=useRef<THREE.Group>(null);const sim=useRef<Simulation|null>(null);
 const mixer=useMemo(()=>new THREE.AnimationMixer(traveler),[traveler]);
 const actions=useMemo(()=>Object.fromEntries(gltf.animations.map(clip=>[clip.name,mixer.clipAction(clip)])),[gltf,mixer]);
 const current=useRef('Idle');const input=useRef(new Set<string>());const look=useRef({yaw:0,pitch:.23});const near=useRef<PlaceId|null>(null);const nearPage=useRef(0);const area=useRef<PlaceId|'arrival'>('arrival');
 const {camera,gl}=useThree();
 const view=useMemo(()=>({pivot:new THREE.Vector3(),motion:new InterpolatedPosition(),camera:new FollowCamera()}),[]);
 useEffect(()=>{let alive=true;createSimulation().then(s=>{if(!alive){s.dispose();return;}sim.current=s;view.motion.reset(s.body.translation());view.camera.reset();props.onReady();}).catch(e=>props.onError(String(e)));return()=>{alive=false;sim.current?.dispose();sim.current=null;};},[]);
 useEffect(()=>{actions.Idle.play();return()=>{mixer.stopAllAction();mixer.uncacheRoot(traveler);};},[actions,mixer,traveler]);
 useEffect(()=>{const down=(e:KeyboardEvent)=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(e.code)&&props.active){e.preventDefault();input.current.add(e.code);}};
 const up=(e:KeyboardEvent)=>input.current.delete(e.code);const clear=()=>input.current.clear();
 const move=(e:MouseEvent)=>{if(props.active){look.current.yaw-=e.movementX*.0022*props.sensitivity;look.current.pitch=THREE.MathUtils.clamp(look.current.pitch+e.movementY*.0018*props.sensitivity,.03,.7);}};
 const context=(e:Event)=>{if(props.active)e.preventDefault();};
 window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);window.addEventListener('mousemove',move);gl.domElement.addEventListener('contextmenu',context);
 return()=>{clear();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);window.removeEventListener('mousemove',move);gl.domElement.removeEventListener('contextmenu',context);};},[props.active,props.sensitivity,gl]);
 useEffect(()=>{input.current.clear();},[props.active]);
 useEffect(()=>{const s=sim.current;if(s){s.reset();view.motion.reset(s.body.translation());}look.current.yaw=0;look.current.pitch=.23;view.camera.reset();props.audio.resetSteps();},[props.reset]);
 useFrame((_,rawDelta)=>{
  const s=sim.current;if(!s||!actor.current)return;const dt=Math.min(rawDelta,.06),keys=input.current;
  s.setGateOpen(props.gateOpen);
  let x=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));
  let z=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));
  if(!props.active){x=0;z=0;}const running=keys.has('ShiftLeft')||keys.has('ShiftRight');const moving=x!==0||z!==0;
  const len=Math.hypot(x,z)||1;x/=len;z/=len;const yaw=look.current.yaw;
  const dx=x*Math.cos(yaw)+z*Math.sin(yaw),dz=-x*Math.sin(yaw)+z*Math.cos(yaw),speed=running?RUN_SPEED:WALK_SPEED;
  const p=view.motion.advance(dt,()=>{s.step(dx*speed*PHYSICS_STEP,dz*speed*PHYSICS_STEP);return s.body.translation();});
  actor.current.position.set(p.x,p.y-.71,p.z);
  if(moving){const target=Math.atan2(dx,dz),a=actor.current.rotation.y;actor.current.rotation.y=a+Math.atan2(Math.sin(target-a),Math.cos(target-a))*(1-Math.exp(-12*dt));}
  const clip:Gait=moving?(running?'Run':'Walk'):'Idle';if(current.current!==clip){actions[current.current]?.fadeOut(.2);actions[clip].reset().fadeIn(.2).play();current.current=clip;}
  actions.Walk.timeScale=3.2;actions.Run.timeScale=3.4;if(props.active)mixer.update(dt);else mixer.update(dt*.3);
  props.audio.step({x:p.x,z:p.z,delta:dt,active:props.active,clip,time:actions[clip].time,duration:actions[clip].getClip().duration});
  const isNear=nearbyPlace(p.x,p.z,props.gateOpen),page=isNear==='workshop'?(workshopStationAt(p.x,p.z)??0):isNear==='education'?(schoolhouseStationAt(p.x,p.z)??0):0;if(isNear!==near.current||page!==nearPage.current){near.current=isNear;nearPage.current=page;props.onNear(isNear,page);}
  const location=currentArea(p.x,p.z);if(location!==area.current){area.current=location;props.onArea(location);}
  view.pivot.set(p.x,p.y+.55,p.z);
  view.camera.update(view.pivot,yaw,look.current.pitch,dt,s.cameraDistance);
  if(props.overview){camera.position.set(6,76,43);camera.lookAt(6,0,-1);}else{camera.position.copy(view.camera.position);camera.lookAt(view.camera.target);}
  gl.domElement.dataset.area=location;
  gl.domElement.dataset.position=`${p.x.toFixed(2)},${(p.y-.71).toFixed(2)},${p.z.toFixed(2)}`;
  gl.domElement.dataset.look=`${look.current.yaw.toFixed(3)},${look.current.pitch.toFixed(3)}`;
  gl.domElement.dataset.audioState=props.audio.state;
  gl.domElement.dataset.footsteps=String(props.audio.stepCount);
  gl.domElement.dataset.footstepBanks=String(props.audio.footstepBanks);
  gl.domElement.dataset.interactions=String(props.audio.interactionCount);
 });
 return <><VillageScene gateOpen={props.gateOpen} discoveryCount={props.discoveryCount}/><InspectHighlights near={near} page={nearPage} active={props.active&&!props.overview}/><group ref={actor} position={[SPAWN[0],.02,SPAWN[2]]} rotation={[0,Math.PI,0]}><primitive object={traveler} scale={1.6}/></group></>;
}
function SunsetSky(){
 const dome=useRef<THREE.Mesh>(null);
 const uniforms=useMemo(()=>({
  zenith:{value:new THREE.Color('#63778f')},horizon:{value:new THREE.Color('#cba28e')},
  sunDirection:{value:new THREE.Vector3(...atmosphere.sunPosition).normalize()},
 }),[]);
 useFrame(({camera})=>{dome.current?.position.copy(camera.position);});
 return <mesh ref={dome} renderOrder={-100} frustumCulled={false}>
  <sphereGeometry args={[150,24,12]}/>
  <shaderMaterial side={THREE.BackSide} depthWrite={false} depthTest={false} toneMapped={false} uniforms={uniforms}
   vertexShader={`varying vec3 skyDirection;
    void main(){skyDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
   fragmentShader={`uniform vec3 zenith;uniform vec3 horizon;uniform vec3 sunDirection;
    varying vec3 skyDirection;
    void main(){
     vec3 direction=normalize(skyDirection);
     vec3 sky=mix(horizon,zenith,smoothstep(0.0,0.65,direction.y));
     float glow=pow(max(dot(direction,sunDirection),0.0),24.0);
     sky+=vec3(0.15,0.055,0.012)*glow;
     gl_FragColor=vec4(sky,1.0);
     #include <colorspace_fragment>
    }`}/>
 </mesh>;
}
export default function Game(props:Props){return <Canvas shadows={!props.low} dpr={props.low?1:[1,1.5]} camera={{position:[0,2.4,31.5],fov:54,near:.08,far:180}} gl={{antialias:true,powerPreference:'high-performance'}}>
 <color attach="background" args={[atmosphere.sky]}/><fog attach="fog" args={props.overview?[atmosphere.fog,140,220]:[atmosphere.fog,42,105]}/>
 <SunsetSky/>
 <hemisphereLight args={[atmosphere.skyLight,atmosphere.groundLight,1.8]}/><ambientLight intensity={.3} color="#bac2d2"/>
 <directionalLight position={atmosphere.sunPosition} intensity={2.65} color={atmosphere.sun} castShadow={!props.low} shadow-mapSize={[2048,2048]} shadow-camera-left={-45} shadow-camera-right={45} shadow-camera-top={45} shadow-camera-bottom={-45} shadow-camera-far={150} shadow-normalBias={.03} shadow-bias={-.0002}/>
 <Suspense fallback={null}><World {...props}/></Suspense>
 </Canvas>;}
