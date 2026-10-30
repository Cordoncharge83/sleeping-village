import {useEffect,useMemo} from 'react';
import {useLoader} from '@react-three/fiber';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {cottages} from './village';
import {cottageParts,type CottagePart} from './cottage-design';
import assets from './assets.json';
import {publicAssetUrl} from './public-asset';

const designs=cottages.map(cottageParts);
function worldMatrix(index:number){const c=cottages[index];return new THREE.Matrix4().makeRotationY(c.rotation).setPosition(c.at[0],0,c.at[1]);}
function instanceParts(geometry:THREE.BufferGeometry,material:THREE.Material,field:'parts'|'glass'|'logs'){
 const count=designs.reduce((n,d)=>n+d[field].length,0),mesh=new THREE.InstancedMesh(geometry,material,count);
 const item=new THREE.Object3D(),color=new THREE.Color();let next=0;
 designs.forEach((design,index)=>{
  const parent=worldMatrix(index);
  for(const part of design[field] as CottagePart[]){
   item.position.fromArray(part.p);item.scale.fromArray(part.s);item.rotation.set(...part.rotation);item.updateMatrix();
   mesh.setMatrixAt(next,new THREE.Matrix4().multiplyMatrices(parent,item.matrix));mesh.setColorAt(next,color.set(part.color));next++;
  }
 });
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
 mesh.computeBoundingBox();mesh.computeBoundingSphere();mesh.castShadow=field!=='glass';mesh.receiveShadow=true;
 return mesh;
}

/** Shared static batches keep extra facade detail inexpensive across all eight homes. */
export function Cottages(){
 const roof=useLoader(GLTFLoader,publicAssetUrl(assets.Roof_RoundTiles_6x6));
 const objects=useMemo(()=>{
  const box=new THREE.BoxGeometry(1,1,1),wallMaterial=new THREE.MeshStandardMaterial({roughness:.95});
  const glassMaterial=new THREE.MeshStandardMaterial({roughness:.65,emissive:'#b18547',emissiveIntensity:.25});
  const walls=instanceParts(box,wallMaterial,'parts'),windows=instanceParts(box,glassMaterial,'glass');
  const logGeometry=new THREE.CylinderGeometry(.09,.09,1,7).rotateX(Math.PI/2),logs=instanceParts(logGeometry,wallMaterial,'logs');
  const vertices:number[]=[],colors:number[]=[],point=new THREE.Vector3(),color=new THREE.Color();
  designs.forEach((design,index)=>{
   const parent=worldMatrix(index);
   for(const triangle of design.gables){
    color.set(triangle.color);
    for(const p of triangle.points){point.fromArray(p).applyMatrix4(parent);vertices.push(...point.toArray());colors.push(color.r,color.g,color.b);}
   }
  });
  const gableGeometry=new THREE.BufferGeometry();gableGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));gableGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));gableGeometry.computeVertexNormals();
  const gableMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide});
  const gables=new THREE.Mesh(gableGeometry,gableMaterial);gables.castShadow=true;gables.receiveShadow=true;
  // Reuse the existing tile texture and geometry; only two shared tile tints are cloned.
  const tileMaterials=new Map<string,THREE.Material>();
  const roofs=cottages.map((c,index)=>{
   const object=roof.scene.clone(true),design=designs[index];
   object.traverse(node=>{if(node instanceof THREE.Mesh){
    node.castShadow=true;node.receiveShadow=true;
    const tint=(source:THREE.Material)=>{
     if(!(source instanceof THREE.MeshStandardMaterial)||source.name!=='MI_RoundTiles')return source;
     const tone=c.style==='tall'?'#b7b9a4':c.style==='storehouse'?'#a5a58f':'#ffffff',key=source.uuid+tone;
     if(tone==='#ffffff')return source;
     let material=tileMaterials.get(key);if(!material){material=source.clone();(material as THREE.MeshStandardMaterial).color.multiply(new THREE.Color(tone));tileMaterials.set(key,material);}return material;
    };
    node.material=Array.isArray(node.material)?node.material.map(tint):tint(node.material);
   }});
   object.position.fromArray(design.roof.p);object.rotation.y=design.roof.rotation;object.scale.fromArray(design.roof.s);
   const group=new THREE.Group();group.position.set(c.at[0],0,c.at[1]);group.rotation.y=c.rotation;group.add(object);return group;
  });
  return {walls,windows,logs,gables,roofs,dispose:()=>{walls.dispose();windows.dispose();logs.dispose();box.dispose();logGeometry.dispose();wallMaterial.dispose();glassMaterial.dispose();gableGeometry.dispose();gableMaterial.dispose();for(const material of tileMaterials.values())material.dispose();}};
 },[roof]);
 useEffect(()=>()=>objects.dispose(),[objects]);
 return <group name="village-homes" dispose={null}>
  <primitive object={objects.walls}/><primitive object={objects.windows}/><primitive object={objects.logs}/><primitive object={objects.gables}/>
  {objects.roofs.map((object,i)=><primitive key={i} object={object}/>)}
 </group>;
}
