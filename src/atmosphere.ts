import * as THREE from 'three';

export const atmosphere = {
 sky:'#948b96', fog:'#81898a', ground:'#294b38', path:'#a28b6d',
 skyLight:'#b5bed6', groundLight:'#304336', sun:'#ffc18b',
 sunPosition:[-38,16,23] as [number,number,number],
};

// Share the woodland variants across instances, just like the loader's source materials.
// Textures and alpha stay intact; only vegetation RGB is remapped from the autumn palette.
const woodlandMaterials=new WeakMap<THREE.Material,THREE.Material>();
export function woodlandMaterial(source:THREE.Material):THREE.Material {
 if(!(source instanceof THREE.MeshStandardMaterial))return source;
 const palettes:Record<string,[string,string]>={
  MapleTree_Leaves:['#193f30','#67834e'],
  BirchTree_Leaves:['#254c36','#819454'],
  Bush_Leaves:['#1c412f','#5d7c48'],
  Grass:['#254933','#6b834c'],
 };
 const palette=palettes[source.name];if(!palette)return source;
 const existing=woodlandMaterials.get(source);if(existing)return existing;
 const material=source.clone();material.roughness=1;
 material.onBeforeCompile=shader=>{
  shader.uniforms.woodlandShade={value:new THREE.Color(palette[0])};
  shader.uniforms.woodlandLight={value:new THREE.Color(palette[1])};
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
   uniform vec3 woodlandShade;
   uniform vec3 woodlandLight;`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float leafLuminance=dot(diffuseColor.rgb,vec3(0.2126,0.7152,0.0722));
   float leafDetail=clamp(pow(max(leafLuminance,0.0),0.65)*1.7,0.0,1.0);
   diffuseColor.rgb=mix(woodlandShade,woodlandLight,leafDetail);`);
 };
 material.customProgramCacheKey=()=> 'woodland-foliage-v1';
 woodlandMaterials.set(source,material);return material;
}
