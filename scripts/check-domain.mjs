import assert from 'node:assert/strict';

const origin=new URL(process.argv[2]??'https://portfolio.moudka.com/');
async function get(path){
 const url=new URL(path,origin),response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000)});
 return {response,text:await response.text(),url};
}
const checks=[
 ['Portfolio homepage and village link',async()=>{
  const {response,text}=await get('/');assert.equal(response.status,200);assert.match(text,/<title[^>]*>Mouadh/i);
  assert.ok(text.includes('href="https://portfolio.moudka.com/village/"')||text.includes('href="/village/"'),'Portfolio must link to the game');
 }],
 ['Project page remains with the portfolio',async()=>{const {response,text}=await get('/projects/smosh-story-finder');assert.equal(response.status,200);assert.match(text,/<title[^>]*>[^<]*Smosh/i);}],
 ['Experience page remains with the portfolio',async()=>{const {response,text}=await get('/experience/imt-atlantique');assert.equal(response.status,200);assert.match(text,/IMT Atlantique/);}],
 ['Shared content stays available',async()=>{const {response,text}=await get('/content.json');assert.equal(response.status,200);assert.equal(typeof JSON.parse(text),'object');assert.equal(response.headers.get('access-control-allow-origin'),'*');}],
 ...['/village','/village?from=domain-check'].map(path=>[`${path} redirects to the game`,async()=>{
  const {response,url}=await get(path);assert.ok([301,308].includes(response.status),'Use a permanent trailing-slash redirect');
  const target=new URL(response.headers.get('location'),url);assert.equal(target.origin,origin.origin);assert.equal(target.pathname,'/village/');
  if(url.search)assert.equal(target.search,url.search,'Preserve query strings');
 }]),
 ['Game owns /village/ and uses its own asset prefix',async()=>{
  const {response,text}=await get('/village/');assert.equal(response.status,200);assert.match(text,/<title[^>]*>The Sleeping Village/);assert.match(text,/src="\/village\/assets\/[^" ]+\.js"/);
 }],
 ['Missing game assets return 404',async()=>{const {response}=await get('/village/assets/domain-check-missing.txt');assert.equal(response.status,404);}],
 ['Unrelated paths remain with the portfolio',async()=>{const {response,text}=await get('/villager');assert.equal(response.status,404);assert.ok(!text.includes('<title>The Sleeping Village'));}],
 ['Existing CV redirect is preserved',async()=>{const {response,url}=await get('/cv');assert.equal(response.status,302);assert.equal(new URL(response.headers.get('location'),url).pathname,'/cv.pdf');}],
];
const results=await Promise.allSettled(checks.map(async([name,run])=>{await run();return name;}));
results.forEach((result,index)=>console.log(`${result.status==='fulfilled'?'PASS':'FAIL'}: ${checks[index][0]}${result.status==='rejected'?': '+result.reason:''}`));
assert.ok(results.every(result=>result.status==='fulfilled'),'Custom-domain checks failed');
console.log(`PASS: ${checks.length} custom-domain routing, link, redirect and content checks on ${origin.origin}.`);
