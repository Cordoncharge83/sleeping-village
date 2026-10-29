import {readFileSync} from 'node:fs';
import * as THREE from 'three';

// Load only the real GLB's transform hierarchy and animation tracks in Node.
// No renderer, texture decoder, browser mock or substitute animation is needed.
export function travelerGait(name){
 const bytes=readFileSync(new URL('../public/assets/Traveler_animated.glb',import.meta.url));
 const length=bytes.readUInt32LE(12),gltf=JSON.parse(bytes.toString('utf8',20,20+length)),binary=bytes.subarray(28+length);
 const objects=gltf.nodes.map(node=>{
  const object=new THREE.Object3D();object.name=THREE.PropertyBinding.sanitizeNodeName(node.name);
  if(node.translation)object.position.fromArray(node.translation);
  if(node.rotation)object.quaternion.fromArray(node.rotation);
  if(node.scale)object.scale.fromArray(node.scale);
  return object;
 });
 gltf.nodes.forEach((node,i)=>node.children?.forEach(child=>objects[i].add(objects[child])));
 const root=new THREE.Group();gltf.scenes[gltf.scene].nodes.forEach(i=>root.add(objects[i]));
 function values(id){
  const a=gltf.accessors[id],v=gltf.bufferViews[a.bufferView],size={SCALAR:1,VEC3:3,VEC4:4}[a.type];
  return new Float32Array(binary.buffer,binary.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*size).slice();
 }
 const animation=gltf.animations.find(clip=>clip.name===name);
 const tracks=animation.channels.map(channel=>{
  const sampler=animation.samplers[channel.sampler],property={translation:'position',rotation:'quaternion',scale:'scale'}[channel.target.path];
  const Track=property==='quaternion'?THREE.QuaternionKeyframeTrack:THREE.VectorKeyframeTrack;
  return new Track(objects[channel.target.node].name+'.'+property,values(sampler.input),values(sampler.output));
 });
 const clip=new THREE.AnimationClip(name,-1,tracks),mixer=new THREE.AnimationMixer(root),action=mixer.clipAction(clip);action.play();
 const feet={left:objects[gltf.nodes.findIndex(node=>node.name==='foot.l')],right:objects[gltf.nodes.findIndex(node=>node.name==='foot.r')]};
 const footPosition=side=>{root.updateMatrixWorld(true);return feet[side].getWorldPosition(new THREE.Vector3());};
 return {mixer,action,clip,footPosition};
}
