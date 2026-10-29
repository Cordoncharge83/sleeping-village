import {cp,readFile,writeFile,mkdir,rm,lstat} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const root=fileURLToPath(new URL('../',import.meta.url));
const build=resolve(root,'dist'),output=resolve(root,'cloudflare-dist');
// Clean only this generated directory directly within the project.
assert.equal(dirname(output),resolve(root));
assert.equal(output,resolve(root,'cloudflare-dist'));
const existing=await lstat(output).catch(error=>{if(error.code==='ENOENT')return null;throw error;});
assert.ok(!existing?.isSymbolicLink(),'Refusing to replace a linked output directory');
const html=await readFile(resolve(build,'index.html'),'utf8');
assert.ok(html.includes('/village/assets/'),'Build the /village/ application before packaging');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(build,resolve(output,'village'),{recursive:true});
// workers.dev opens at /; the final portfolio root is handled by its own Worker.
await writeFile(resolve(output,'_redirects'),'/ /village/ 302\n/village /village/ 301\n');
console.log('Cloudflare assets ready: cloudflare-dist/village/ (with root and trailing-slash redirects).');
