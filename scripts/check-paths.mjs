import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// Run against the built preview, not Vite's development fallback.
const origin=new URL(process.argv[2]??'http://127.0.0.1:5173/');
const base=new URL('/village/',origin);
const checked=new Set();
async function resource(url){
 assert.equal(url.origin,base.origin,'Game assets must stay on the current origin');
 assert.ok(url.pathname.startsWith(base.pathname),`Asset escaped /village/: ${url}`);
 const response=await fetch(url,{signal:AbortSignal.timeout(15000)});
 assert.equal(response.status,200,`Missing resource: ${url}`);
 const bytes=Buffer.from(await response.arrayBuffer());
 assert.ok(bytes.length>0,`Empty resource: ${url}`);
 assert.ok(!response.headers.get('content-type')?.includes('text/html'),`SPA fallback returned instead of asset: ${url}`);
 checked.add(url.href);return bytes;
}
const htmlResponse=await fetch(base,{signal:AbortSignal.timeout(15000)});
assert.equal(htmlResponse.status,200);
const html=await htmlResponse.text();
const entryPaths=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
assert.ok(entryPaths.some(p=>p.endsWith('.js')),'Production entry script missing');
assert.ok(!html.includes('/src/main.tsx'),'Use the built preview for this check');
assert.match(html,/<link[^>]+rel="icon"[^>]+href="\/village\/favicon\.svg"/,'Favicon must resolve under /village/');
for(const path of entryPaths){
 const url=new URL(path,base),bytes=await resource(url);
 if(url.pathname.endsWith('.css')){
  const fonts=[...bytes.toString().matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m=>m[1]);
  assert.ok(fonts.length>=4,'Bundled fonts missing');
  for(const font of fonts){const fontBytes=await resource(new URL(font,url));assert.equal(fontBytes.toString('ascii',0,4),'wOF2','Expected a WOFF2 font');}
 }
}
const models=JSON.parse(await readFile(new URL('../src/assets.json',import.meta.url),'utf8'));
for(const path of Object.values(models)){
 const url=new URL(base.pathname+path.replace(/^\/+/,''),base),bytes=await resource(url);
 if(url.pathname.endsWith('.glb'))assert.equal(bytes.toString('ascii',0,4),'glTF','Expected a binary glTF');
 else{
  const model=JSON.parse(bytes.toString());
  for(const entry of [...(model.buffers??[]),...(model.images??[])]){
   if(entry.uri&&!entry.uri.startsWith('data:'))await resource(new URL(entry.uri,url));
  }
 }
}
const journal=await readFile(new URL('../src/journal-data.ts',import.meta.url),'utf8');
const journalImages=new Set([...journal.matchAll(/image:'([^']+)'/g)].map(m=>m[1]));
for(const path of journalImages){
 const bytes=await resource(new URL(base.pathname+path.replace(/^\/+/,''),base));
 assert.equal(bytes.toString('hex',0,8),'89504e470d0a1a0a','Expected a PNG screenshot');
}
console.log(`PASS: /village/ production entry, favicon, bundles, fonts, ${Object.keys(models).length} models and their dependencies, and ${journalImages.size} journal screenshots (${checked.size} unique resources).`);
