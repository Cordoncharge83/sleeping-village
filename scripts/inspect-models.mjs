import fs from 'node:fs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Box3,Vector3} from 'three';
const assets=JSON.parse(fs.readFileSync('src/assets.json'));
for(const [name,url] of Object.entries(assets)) {
 const path='public'+url;
 let doc;
 if(path.endsWith('.glb')) {
  const b=fs.readFileSync(path);doc=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());
  const start=20+b.readUInt32LE(12);doc.buffers[0].uri='data:application/octet-stream;base64,'+b.subarray(start+8,start+8+b.readUInt32LE(start)).toString('base64');
 } else {doc=JSON.parse(fs.readFileSync(path));for(const b of doc.buffers){b.uri='data:application/octet-stream;base64,'+fs.readFileSync(new URL(b.uri, new URL('file:///'+process.cwd().replaceAll('\\','/')+'/'+path))).toString('base64');}}
 doc.images=[]; doc.textures=[];doc.materials=[{}];for(const mesh of doc.meshes) for(const p of mesh.primitives) p.material=0;
 globalThis.ProgressEvent=class ProgressEvent{};
 const gltf=await new GLTFLoader().parseAsync(JSON.stringify(doc),'');
 const box=new Box3().setFromObject(gltf.scene);console.log(name,JSON.stringify({min:box.min.toArray(),max:box.max.toArray(),size:box.getSize(new Vector3()).toArray(),animations:gltf.animations.map(a=>a.name)}));
}
