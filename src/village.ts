// One shared layout drives the visible village, collision geometry, and route checks.
export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type PlaceId = 'workshop' | 'smosh' | 'bargainy' | 'atlas' | 'duel' | 'future' | 'square';
export type Building = {id: Exclude<PlaceId, 'future' | 'square'>; at: Vec2; rotation: number; title: string; subtitle: string};
export type Solid = {p: Vec3; s: Vec3; rotation?: number};
export const tavernLayout:Record<string,Solid>={
 counter:{p:[0,.65,-2.12],s:[4.7,1.05,.85]},
 ledger:{p:[-1.55,.62,.15],s:[1.5,1.06,1.65]},
 supper:{p:[1.57,.62,.05],s:[.85,1.06,1.7]},
 seat:{p:[2.44,.4,.1],s:[.5,.65,2.65]},
 barrel:{p:[-2.38,.43,-1.45],s:[.6,.7,.6]},
 terraceLeft:{p:[-2.1,.4,4.7],s:[.5,.65,2.5]},
 terraceRight:{p:[2.1,.4,4.7],s:[.5,.65,2.5]},
 planterLeft:{p:[-2.55,.24,3.5],s:[.7,.48,.65]},
 planterRight:{p:[2.55,.24,3.5],s:[.7,.48,.65]},
};
export const SPAWN: Vec3 = [0, .74, 27];
export const BOUNDS = {left:-28, right:28, back:-37, front:33};
export const buildings: Building[] = [
 {id:'workshop', at:[-11,14], rotation:Math.PI/2, title:'THE WORKSHOP', subtitle:'Experience'},
 {id:'smosh', at:[-13,1], rotation:Math.PI/2, title:'STORY & SUPPER', subtitle:'Smosh Story Finder'},
 {id:'bargainy', at:[13,1], rotation:-Math.PI/2, title:'THE TRADING POST', subtitle:'Bargainy'},
 {id:'atlas', at:[-11,-14], rotation:Math.PI/2, title:'THE MAP LODGE', subtitle:'Comp Atlas'},
 {id:'duel', at:[11,-14], rotation:-Math.PI/2, title:'THE TOURNAMENT YARD', subtitle:'DuelSync'},
];
export function localPoint(building: Building, x:number, z:number): Vec2 {
 const c=Math.cos(building.rotation),s=Math.sin(building.rotation);
 return [building.at[0]+x*c+z*s,building.at[1]-x*s+z*c];
}
export function localSolid(building:Building, p:Vec3, s:Vec3):Solid {
 const [x,z]=localPoint(building,p[0],p[2]);
 return {p:[x,p[1],z],s,rotation:building.rotation};
}
export const paths: {points:Vec2[]; width:number; closed?:boolean}[] = [
 {points:[[0,29],[-.5,23],[-1,17],[0,10],[0,5]],width:3.5},
 {points:[[0,10],[-6,8],[-7,1],[-6,-14],[0,-20],[6,-14],[7,1],[6,8]],width:3.6,closed:true},
 {points:[[-7,1],[0,1],[7,1]],width:3.4},
 {points:[[-6,-14],[-3,-8],[-2,0]],width:3.2},
 {points:[[6,-14],[3,-8],[2,0]],width:3.2},
 {points:[[0,-20],[0,-24],[0,-28]],width:3.2},
 {points:[[-1,16],[-4,14],[-8,14]],width:3},
 {points:[[-7,1],[-10,1]],width:3},
 {points:[[7,1],[10,1]],width:3},
 {points:[[-6,-14],[-8,-14]],width:3},
 {points:[[6,-14],[8,-14]],width:3},
];
export const places: Record<PlaceId, {title:string; name:string; at:Vec2; hint:string; description:string; status:string}> = {
 workshop:{title:'The woodland workshop',name:'Professional experience',at:localPoint(buildings[0],0,1),hint:'Step inside the open workshop.',description:'This workshop will introduce my work at Sopra Steria and La Banque Postale. For this layout test, try the entrance and walk around the workbench.',status:'Experience stop · layout preview'},
 smosh:{title:'Story & Supper',name:'Smosh Story Finder',at:localPoint(buildings[1],-.25,1.2),hint:'The open ledger on the left holds a familiar story.',description:'Find that Smosh Reddit story you remember. Open the tavern’s story ledger to explore the live archive, the work behind it, and screenshots of the product.',status:'Live · Archive expanding'},
 bargainy:{title:'The trading post',name:'Bargainy',at:localPoint(buildings[2],0,1.2),hint:'Look inside the merchant’s shop.',description:'The merchant’s shop will introduce Bargainy, an AI negotiation coach. The counter sits at the back so the entrance and camera have room.',status:'Project stop · display to come'},
 atlas:{title:'The map lodge',name:'Comp Atlas',at:localPoint(buildings[3],0,1.2),hint:'A quiet place to plan the next match.',description:'This lodge will showcase the VALORANT research and scouting tools in Comp Atlas through screenshots and a planned video walkthrough. The product is not yet open to public visitors.',status:'In active development · showcase to come'},
 duel:{title:'The tournament yard',name:'DuelSync',at:localPoint(buildings[4],0,1.2),hint:'Walk into the covered courtyard.',description:'This open courtyard will introduce DuelSync, a desktop companion for tournament organizers. A bracket board and game tables will tell its story.',status:'Project stop · display to come'},
 future:{title:'The future clearing',name:'Ideas taking shape',at:[0,-27],hint:'Two projects on the horizon.',description:'Manart is the codename for the house-building game, with further development planned. The unnamed penguin board game is an early idea with a few initial rules. Their signs mark this optional clearing.',status:'Manart · planned / Penguin game · early concept'},
 square:{title:'The village square',name:'Welcome to the village',at:[0,2],hint:'Choose a path. Every project connects back here.',description:'A small woodland village built around making, trading, playing, and telling stories. Explore the loop in either direction, or cross the square to another destination. This first village build is for testing the layout; the full portfolio displays come next.',status:'Village layout · first walk-through'},
};
export function nearbyPlace(x:number,z:number):PlaceId|null {
 let best:PlaceId|null=null,distance=2.15;
 for(const [id,p] of Object.entries(places)) {
  const d=Math.hypot(x-p.at[0],z-p.at[1]);
  // The ledger is an indoor interaction; don't offer it from outside the side wall.
  if(id==='smosh'){
   const b=buildings[1],c=Math.cos(b.rotation),s=Math.sin(b.rotation);
   const localX=(x-b.at[0])*c-(z-b.at[1])*s,localZ=(x-b.at[0])*s+(z-b.at[1])*c;
   if(Math.abs(localX)>2.65||localZ<-.9||localZ>2.5||d>1.55)continue;
  }
  if(d<distance){distance=d;best=id as PlaceId;}
 }
 return best;
}
export function currentArea(x:number,z:number):PlaceId|'arrival' {
 if(z>19)return 'arrival';
 if(z<-23&&Math.abs(x)<9)return 'future';
 let best:PlaceId='square',distance=8;
 for(const b of buildings){const d=Math.hypot(x-b.at[0],z-b.at[1]);if(d<distance){best=b.id;distance=d;}}
 return best==='square'&&z>8?'arrival':best;
}
export const trees: [number,number,number,number][] = [
 [0,-2.5,1.65,1], [-5,22,1.15,0],[6,24,1.3,1],[-7,28,1.4,1],[8,30,1.3,0],
 [-19,15,1.45,1],[-20,7,1.2,0],[-21,-3,1.4,1],[-19,-12,1.1,0],[-17,-22,1.35,1],
 [19,14,1.4,0],[21,6,1.2,1],[21,-4,1.3,0],[19,-13,1.4,1],[16,-23,1.3,0],
 [-10,-29,1.4,0],[10,-30,1.3,1],[-7,-34,1.4,1],[5,-35,1.3,0],
 [-18,26,1.4,0],[18,27,1.3,1],[-19,-31,1.4,1],[19,-32,1.5,0],
];
for(let i=0;i<24;i++){
 const a=i*Math.PI*2/24;
 trees.push([Math.cos(a)*(31+(i%3)*2),Math.sin(a)*(38+(i%4)),1.25+(i%4)*.15,i%2]);
}
export const fenceLines: {a:Vec2;b:Vec2}[] = [
 {a:[-27,32],b:[-3,32]}, {a:[3,32],b:[27,32]},
 {a:[-27,32],b:[-27,-36]}, {a:[27,32],b:[27,-36]},
 {a:[-27,-36],b:[27,-36]},
 {a:[-6,-25],b:[-2.5,-25]}, {a:[2.5,-25],b:[6,-25]},
 {a:[-6,-25],b:[-6,-32]}, {a:[6,-25],b:[6,-32]}, {a:[-6,-32],b:[6,-32]},
];
const buildingSolids:Solid[]=[];
for(const b of buildings){
 const add=(p:Vec3,s:Vec3)=>buildingSolids.push(localSolid(b,p,s));
 add([0,.025,0],[6,.1,6]);
 if(b.id!=='duel'){
  add([0,1.56,-3],[6.2,3.12,.35]);
  add([-3,1.56,0],[.35,3.12,6]);add([3,1.56,0],[.35,3.12,6]);
 }else add([0,1.4,-2.85],[3.5,2.8,.2]);
 add([0,3.32,0],[7,.3,6.8]);
 for(const x of [-2.85,2.85])for(const z of [-3,3])add([x,1.5,z],[.24,3,.24]);
 if(b.id==='workshop'){
  add([0,.53,-1.8],[2.1,.9,1.05]);add([-1.95,.58,.9],[.8,1,.8]);
  add([2.25,.53,-1.9],[.75,.9,.75]);add([2.2,.35,-.6],[.65,.6,.7]);add([.75,.34,-.4],[.46,.58,.46]);
 }else if(b.id==='bargainy')add([0,.6,-1.7],[3.6,1.05,.9]);
 else if(b.id==='atlas')add([-1.6,.6,-.9],[1.4,1.05,2.1]);
 else if(b.id==='smosh'){
  for(const item of Object.values(tavernLayout))add(item.p,item.s);
 }else if(b.id==='duel')for(const x of [-1.9,1.9])add([x,.55,-.5],[1.1,1,1.5]);
}
export const solids:Solid[]=[
 {p:[0,-.15,0],s:[100,.3,110]},...buildingSolids,
 ...trees.map(([x,z,s])=>({p:[x,1.7,z] as Vec3,s:[.65*s,3.4,.65*s] as Vec3})),
 // Low bench silhouettes around the landmark; the front crossing stays open.
 {p:[-2.5,.4,-2.5],s:[.65,.8,2.5]}, {p:[2.5,.4,-2.5],s:[.65,.8,2.5]},
 ...fenceLines.map(({a,b})=>({p:[(a[0]+b[0])/2,.65,(a[1]+b[1])/2] as Vec3,s:[Math.hypot(b[0]-a[0],b[1]-a[1]),1.3,.14] as Vec3,rotation:-Math.atan2(b[1]-a[1],b[0]-a[0])})),
 {p:[-3,.25,-29],s:[3,.5,3]}, {p:[3.5,.55,-29],s:[2,1.1,2]},
 {p:[2.3,.9,20],s:[.15,1.8,.15]}, {p:[2.3,.9,-21.5],s:[.15,1.8,.15]},
 {p:[BOUNDS.left,3,-2],s:[.5,6,74]}, {p:[BOUNDS.right,3,-2],s:[.5,6,74]},
 {p:[0,3,BOUNDS.back],s:[57,6,.5]}, {p:[0,3,BOUNDS.front],s:[57,6,.5]},
];
