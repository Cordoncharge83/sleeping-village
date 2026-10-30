import type {Cottage,Solid,Vec3} from './village.ts';

export type CottagePart={p:Vec3;s:Vec3;color:string;rotation:Vec3};
export type CottageTriangle={points:[Vec3,Vec3,Vec3];color:string};
export function cottageEnvelope(c:Cottage){
 const store=c.style==='storehouse';
 return {width:c.width-(store?1.1:0),depth:c.depth,x:store?-.55:0,height:c.height,rise:c.roofRise};
}

/** The closed body and stepped roof proxies follow each home's visible dimensions. */
export function cottageSolids(c:Cottage):Solid[]{
 const b=cottageEnvelope(c),result:Solid[]=[{p:[b.x,b.height/2,0],s:[b.width,b.height,b.depth]}];
 const span=c.crossRoof?b.depth:b.width,along=c.crossRoof?b.width:b.depth;
 for(let i=0;i<5;i++){
  const width=span*(1-i/5),height=b.rise/5;
  result.push({p:[b.x,b.height+.12+(i+.5)*height,0],s:c.crossRoof?[along,height,width]:[width,height,along]});
 }
 if(c.style==='storehouse'){
  const centre=c.width/2-.55;
  result.push({p:[centre,1.02,0],s:[1.1,2.04,c.depth]});
  for(let i=0;i<3;i++){
   const x=centre-.55+(i+.5)*1.1/3,top=2.32-Math.tan(.48)*(x-centre)+.1;
   result.push({p:[x,(top+2.04)/2,0],s:[1.1/3,top-2.04,c.depth]});
  }
 }
 return result;
}

/** Local, static parts; all homes' cubes are drawn together with per-instance color. */
export function cottageParts(c:Cottage){
 const b=cottageEnvelope(c),wood='#584a39',dark='#493e31',stone='#7e8174';
 const parts:CottagePart[]=[],glass:CottagePart[]=[],logs:CottagePart[]=[],gables:CottageTriangle[]=[];
 const add=(p:Vec3,s:Vec3,color=wood,rotation:Vec3=[0,0,0])=>parts.push({p,s,color,rotation});
 const front=b.depth/2;
 add([b.x,b.height/2,0],[b.width,b.height,b.depth],c.color);
 add([0,.17,0],[c.width+.06,.34,c.depth+.06],stone);
 // Corner posts, wall plate, and a restrained stone/plaster plinth.
 for(const x of [-1,1])for(const z of [-1,1])add([b.x+x*(b.width/2-.09),b.height/2,z*(front+.025)],[.17,b.height,.16]);
 for(const z of [-1,1])add([b.x,b.height-.09,z*(front+.025)],[b.width,.18,.16]);
 if(c.crossRoof){
  for(const side of [-1,1])gables.push({points:[[b.x+side*b.width/2,b.height,-front],[b.x+side*b.width/2,b.height,front],[b.x+side*b.width/2,b.height+b.rise+.08,0]],color:c.color});
 }else{
  for(const side of [-1,1]){
   const z=side*front;gables.push({points:[[b.x-b.width/2,b.height,z],[b.x+b.width/2,b.height,z],[b.x,b.height+b.rise+.08,z]],color:c.color});
   add([b.x,b.height+b.rise*.43,side*(front+.035)],[.13,b.rise*.9,.13]);
  }
 }
 function window(x:number,y:number,z:number,width=.76,height=.87,turn=0,shutters=true){
  const co=Math.cos(turn),si=Math.sin(turn);
  const point=(dx:number,dy:number,dz:number):Vec3=>[x+dx*co+dz*si,y+dy,z-dx*si+dz*co];
  const piece=(p:Vec3,s:Vec3,color:string)=>add(point(...p),s,color,[0,turn,0]);
  piece([0,0,0],[width+.16,height+.16,.11],dark);
  glass.push({p:point(0,0,.065),s:[width,height,.035],color:'#c7ad7b',rotation:[0,turn,0]});
  piece([0,0,.095],[.06,height,.05],wood);piece([0,0,.095],[width,.06,.05],wood);
  piece([0,-height/2-.1,.045],[width+.28,.12,.21],wood);
  if(shutters)for(const side of [-1,1]){
   piece([side*(width/2+.22),0,.025],[.29,height+.07,.09],c.accent);
   for(const dy of [-.25,.25])piece([side*(width/2+.22),dy,.078],[.28,.045,.025],wood);
  }
 }
 const store=c.style==='storehouse',doorX=store?b.x+.12:c.style==='tall'?b.x-.75:b.x+.48;
 const doorWidth=store?1.6:.96;
 add([doorX,1.03,front+.05],[doorWidth+.18,2.06,.12],dark);
 add([doorX,1.02,front+.125],[doorWidth,1.91,.055],c.style==='cottage'?c.accent:'#736047');
 const plankCount=store?8:5;
 for(let i=1;i<plankCount;i++)add([doorX-doorWidth/2+i*doorWidth/plankCount,1.02,front+.158],[.016,1.9,.02],dark);
 for(const y of [.55,1.55])add([doorX,y,front+.18],[doorWidth-.08,.065,.04],wood);
 add([doorX+doorWidth*.32,1.03,front+.21],[.075,.075,.055],'#b39c62');
 add([doorX,.12,front+.1],[doorWidth+.3,.2,.34],stone);
 if(store){
  window(b.x-1.3,1.82,front+.06,.52,.63,0,false);
  // A lower timber lean-to remains inside the existing house footprint.
  add([c.width/2-.55,1.02,0],[1.1,2.04,c.depth],'#81725a');
  add([c.width/2-.55,2.32,0],[1.55,.12,c.depth+.4],wood,[0,0,-.48]);
  for(let i=0;i<5;i++)add([c.width/2-.98+i*.21,1.04,front+.04],[.035,1.98,.055],dark);
  add([c.width/2-.55,.4,front+.15],[.8,.6,.36],'#8b7757');
 }else if(c.style==='tall'){
  window(b.x+.85,1.65,front+.06,.66,.83);
  for(const x of [-.95,.95])window(b.x+x,3.24,front+.06,.65,.8);
  add([b.x,2.45,front+.045],[b.width,.2,.18]);
  for(const side of [-1,1])add([b.x+side*(b.width/2-.14),2.43,0],[.2,.2,b.depth]);
 }else{
  window(b.x-1.12,1.61,front+.06,.78,.88);
  // A small closed-door canopy gives low cottages a more sheltered entrance.
  if(c.style==='cottage'){
   add([doorX,2.2,front+.25],[1.5,.12,.7],c.accent,[-.18,0,0]);
   for(const side of [-1,1])add([doorX+side*.58,2.01,front+.14],[.1,.45,.12],wood);
   add([b.x-1.12,1.02,front+.15],[1.07,.2,.32],'#82684b');
   add([b.x-1.12,1.15,front+.15],[.86,.12,.25],'#4c6844');
   for(const [i,color] of ['#c0a55c','#a57465','#c0a55c'].entries())add([b.x-1.41+i*.29,1.23,front+.18],[.08,.08,.08],color);
  }
 }
 // Side windows prevent the houses from reading as blank boxes along the lanes.
 for(const side of [-1,1])window(b.x+side*(b.width/2+.055),c.style==='tall'?3.12:1.62,-.42,.64,.76,side*Math.PI/2,c.style!=='storehouse');
 window(b.x+.6,1.62,-front-.055,.64,.76,Math.PI,c.style!=='storehouse');
 if(c.style==='tall')window(b.x-.55,3.15,-front-.055,.64,.76,Math.PI);
 if(c.style==='timber'){
  window(b.x,b.height+b.rise*.42,front+.06,.5,.55,0,false);
  for(const x of [-.35,1.25])add([b.x+x,b.height/2,front+.035],[.13,b.height,.13]);
  for(const y of [.62,2.5])add([b.x,y,front+.04],[b.width,.14,.13]);
  for(const side of [-1,1]){
   add([b.x+side*b.width*.34,.36,front+.05],[1.25,.12,.12],wood,[0,0,side*.42]);
   add([b.x+side*(b.width/2+.04),.62,0],[.13,.14,b.depth]);
   for(const z of [-1.35,1.35])add([b.x+side*(b.width/2+.04),1.5,z],[.13,b.height,.14]);
  }
 }
 // A short stone chimney with a cap; placement and height vary by design.
 const chimneyX=b.x+(c.style==='tall'?-1:1)*b.width*.27,chimneyZ=-b.depth*.23;
 const chimneyBottom=b.height+b.rise*.45,chimneyHeight=c.style==='tall'?1.2:1.1;
 add([chimneyX,chimneyBottom+chimneyHeight/2,chimneyZ],[.52,chimneyHeight,.58],stone);
 add([chimneyX,chimneyBottom+chimneyHeight,chimneyZ],[.67,.14,.72],'#65685d');
 add([chimneyX,chimneyBottom+chimneyHeight+.075,chimneyZ],[.36,.02,.42],'#494c43');
 if(c.style==='cottage'||store){
  const pileX=store?b.x-b.width*.32:b.x-1.12;
  for(let row=0;row<3;row++)for(let i=0;i<3-row;i++)logs.push({p:[pileX+(i-(2-row)/2)*.18,.1+row*.16,front-.04],s:[1,1,.38],color:(i+row)%2?'#8f7856':'#a18a65',rotation:[0,0,0]});
 }
 return {parts,glass,logs,gables,roof:{p:[b.x,b.height+.15,0] as Vec3,s:(c.crossRoof?[b.depth/7,b.rise/4.34,b.width/7]:[b.width/7,b.rise/4.34,b.depth/7]) as Vec3,rotation:c.crossRoof?Math.PI/2:0}};
}
