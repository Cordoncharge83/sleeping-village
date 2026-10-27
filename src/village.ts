// One shared layout drives the visible village, collision geometry, and route checks.
export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type PlaceId = 'workshop' | 'smosh' | 'bargainy' | 'atlas' | 'duel' | 'education' | 'future' | 'square' | 'welcome' | 'gate';
export type Building = {id: Exclude<PlaceId, 'future' | 'square' | 'welcome' | 'gate'>; at: Vec2; rotation: number; title: string; subtitle: string};
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
export const workshopLayout:Record<string,Solid>={
 bench:{p:[0,.53,-1.8],s:[2.1,.9,1.05]},
 research:{p:[-2,.6,.45],s:[1.25,1.02,1.75]},
 planning:{p:[2,.6,1.35],s:[1.25,1.02,1.2]},
 anvil:{p:[-2.2,.58,-1.85],s:[.8,1,.8]},
 barrel:{p:[2.25,.53,-1.9],s:[.75,.9,.75]},
};
export const mapLodgeLayout:Record<string,Solid>={
 desk:{p:[0,.6,-1.8],s:[2.4,1.02,1]},
 lab:{p:[-1.95,.6,.4],s:[1.25,1.02,1.85]},
 archive:{p:[2.42,1.05,-.7],s:[.6,1.92,2]},
 bench:{p:[2.25,.4,1.55],s:[.5,.65,1.65]},
};
export function mapLodgeNearby(x:number,z:number):boolean {
 return stationAt(buildings[3],[{at:[0,-.45]}],x,z)!==null;
}
export const tournamentLayout:Record<string,Solid>={
 desk:{p:[0,.6,-1.65],s:[2.1,1.02,1]},
 leftTable:{p:[-1.8,.6,.65],s:[1.15,1.02,1.6]},
 rightTable:{p:[1.8,.6,.65],s:[1.15,1.02,1.6]},
 leftSeat:{p:[-2.65,.4,.65],s:[.5,.65,1.6]},
 rightSeat:{p:[2.65,.4,.65],s:[.5,.65,1.6]},
};
export function tournamentNearby(x:number,z:number):boolean {
 return stationAt(buildings[4],[{at:[0,-.35]}],x,z)!==null;
}
export const tradingPostLayout:Record<string,Solid>={
 counter:{p:[0,.64,-1.85],s:[3.6,1.1,.95]},
 goods:{p:[-2.42,1.05,.05],s:[.7,1.92,1.95]},
 barrel:{p:[2.25,.53,-1.8],s:[.75,.9,.75]},
 crates:{p:[2.2,.45,.15],s:[.8,.72,.85]},
};
export function tradingPostNearby(x:number,z:number):boolean {
 return stationAt(buildings[2],[{at:[0,-.35]}],x,z)!==null;
}
export const schoolhouseLayout:Record<string,Solid>={
 desk:{p:[0,.6,-1.7],s:[2.2,1.02,1.2]},
 skills:{p:[2,.6,.45],s:[1.2,1.02,1.8]},
 bookcase:{p:[-2.5,1.25,-1.25],s:[.65,2.32,2.1]},
 bench:{p:[-2.25,.4,1.35],s:[.5,.65,1.75]},
};
export const schoolhouseStations=[
 {at:[0,-.4] as Vec2,prompt:'Read the study ledger'},
 {at:[1,.45] as Vec2,prompt:'Explore the skills display'},
];
export function schoolhouseStationAt(x:number,z:number):number|null {
 return stationAt(buildings[5],schoolhouseStations,x,z);
}
export const workshopStations=[
 {at:[0,-.6] as Vec2,prompt:'Read the maintenance notebook'},
 {at:[-1,.45] as Vec2,prompt:'Explore the research notes'},
 {at:[1,1.35] as Vec2,prompt:'Read the WAKE planner'},
];
// Positions describe the accessible side of each display, not the furniture centre.
export function workshopStationAt(x:number,z:number):number|null {
 return stationAt(buildings[0],workshopStations,x,z);
}
function stationAt(b:Building,stations:{at:Vec2}[],x:number,z:number):number|null {
 const c=Math.cos(b.rotation),s=Math.sin(b.rotation);
 const localX=(x-b.at[0])*c-(z-b.at[1])*s,localZ=(x-b.at[0])*s+(z-b.at[1])*c;
 if(Math.abs(localX)>2.65||localZ< -2.7||localZ>2.5)return null;
 let page:number|null=null,distance=1.05;
 stations.forEach((station,index)=>{const d=Math.hypot(localX-station.at[0],localZ-station.at[1]);if(d<distance){page=index;distance=d;}});
 return page;
}
export const SPAWN: Vec3 = [4, .74, 28];
export const BOUNDS = {left:-29, right:41, back:-35, front:34};
export const GATE_Z=-17;
export const gateSolid:Solid={p:[0,1.35,GATE_Z],s:[4.8,2.7,.32]};
export const landmark:Vec2=[0,-1];
export const buildings: Building[] = [
 {id:'workshop', at:[-13,12], rotation:Math.PI/2, title:'THE WORKSHOP', subtitle:'Experience & leadership'},
 {id:'smosh', at:[13,18], rotation:Math.PI, title:'STORY & SUPPER', subtitle:'Smosh Story Finder'},
 {id:'bargainy', at:[27,7.5], rotation:0, title:'THE TRADING POST', subtitle:'Bargainy'},
 {id:'atlas', at:[18,-10.25], rotation:0, title:'THE MAP LODGE', subtitle:'Comp Atlas'},
 {id:'duel', at:[33,-1], rotation:-Math.PI/2, title:'THE TOURNAMENT YARD', subtitle:'DuelSync'},
 {id:'education', at:[-20,0], rotation:Math.PI/2, title:'THE SCHOOLHOUSE', subtitle:'Education & skills'},
];
export type Cottage={at:Vec2;rotation:number;width:number;depth:number;color:string};
// Closed homes give the streets edges without adding more destinations to inspect.
export const cottages:Cottage[]=[
 {at:[-7,20],rotation:-.2,width:5,depth:4.5,color:'#aa9576'},
 {at:[13,27.5],rotation:Math.PI,width:5.2,depth:5,color:'#a89170'},
 {at:[-22,13],rotation:.2,width:4.8,depth:5,color:'#988976'},
 {at:[-10,-7],rotation:.12,width:5,depth:4.5,color:'#b09e7c'},
 {at:[7,-11.5],rotation:0,width:4.6,depth:4.4,color:'#a39277'},
 {at:[12,0],rotation:Math.PI,width:5,depth:5,color:'#b29a79'},
 {at:[21.5,1],rotation:Math.PI,width:4.5,depth:4,color:'#9b8e78'},
 {at:[34,17],rotation:-Math.PI/2,width:5,depth:4.6,color:'#aa967d'},
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
 {points:[[4,31],[4,22],[1,17],[-1,11],[0,4]],width:3.8},
 {points:[[0,4],[4,2],[4,-4],[0,-6],[-4,-4],[-4,2]],width:3.6,closed:true},
 {points:[[-3,4],[-6,8],[-7.5,11],[-9.9,12]],width:3.4},
 {points:[[-4,0],[-10,1],[-16,0]],width:3.5},
 {points:[[4,4],[8,7],[13,10],[22,13],[28,13]],width:4.2},
 {points:[[13,10],[13,15]],width:3.2},
 {points:[[27,13],[27,10]],width:3.2},
 {points:[[4,-4],[10,-6],[18,-5],[27,-2],[29,0]],width:4},
 {points:[[18,-5],[18,-6]],width:3.2},
 {points:[[0,-6],[1,-10],[0,-15],[0,-22],[0,-27]],width:3.6},
];
export const places: Record<PlaceId, {title:string; name:string; at:Vec2; hint:string; description:string; status:string}> = {
 workshop:{title:'The woodland workshop',name:'Experience & leadership',at:localPoint(buildings[0],0,-.6),hint:'A maintenance notebook, research notes, and an event planner.',description:'Three displays tell the stories of my work at Sopra Steria and La Banque Postale, and leading the WAKE student committee.',status:'Engineering & teamwork'},
 smosh:{title:'Story & Supper',name:'Smosh Story Finder',at:localPoint(buildings[1],-.25,1.2),hint:'The open ledger on the left holds a familiar story.',description:'Find that Smosh Reddit story you remember. Open the tavern’s story ledger to explore the live archive, the work behind it, and screenshots of the product.',status:'Live · Archive expanding'},
 bargainy:{title:'The trading post',name:'Bargainy',at:localPoint(buildings[2],0,-.35),hint:'An open negotiation notebook waits on the merchant’s counter.',description:'Practise a negotiation with Bargainy, then review the coaching debrief. The notebook holds the idea, the work behind it, and a view of the product.',status:'Bargainy · Practice & coaching'},
 atlas:{title:'The map lodge',name:'Comp Atlas',at:localPoint(buildings[3],0,-.45),hint:'Read the scouting ledger beneath the wall map.',description:'Explore composition research and opponent preparation in Comp Atlas. The scouting ledger holds its story and a Team Prep screenshot. The application is still in development and not publicly available.',status:'In development · Not publicly available'},
 duel:{title:'The tournament yard',name:'DuelSync',at:localPoint(buildings[4],0,-.35),hint:'The organiser’s ledger waits beneath the Top Cut board.',description:'A companion for the organiser’s table. Read about local tournament management, deliberate publishing, and player-facing pairings and standings.',status:'DuelSync · Tournament companion'},
 education:{title:'The schoolhouse',name:'Education & skills',at:localPoint(buildings[5],0,-.4),hint:'Read the study ledger, then explore the skills table.',description:'Education and selected skills behind the projects.',status:'Education & skills'},
 future:{title:'The future clearing',name:'Ideas taking shape',at:[0,-26],hint:'Two projects on the horizon.',description:'Manart and an unnamed penguin board game: a place for ideas still taking shape.',status:'Bonus journal entry'},
 square:{title:'The old-tree square',name:'Welcome to the village',at:[0,4],hint:'Projects to the east. Experience and learning to the west.',description:'The old tree is the heart of the village. Two project streets branch east, while the workshop and schoolhouse lie west. Six discoveries open the northern garden gate.',status:'The heart of the village'},
 welcome:{title:'The woodland entrance',name:'Welcome, traveler',at:[4,20],hint:'Read the welcome sign, then follow the bend to the old tree.',description:'Walk with WASD, run with Shift, and look around with the mouse. Press E near an open building’s display to add its story to your journal. Press J to read, M for the map, or Escape to pause. Closed cottages are village homes.',status:'Your journey begins'},
 gate:{title:'The garden gate',name:'Beyond the village',at:[0,-14.7],hint:'Six stories open the way to what comes next.',description:'Find the four projects, the workshop, and the schoolhouse. Their six journal entries open this gate to the future clearing.',status:'A reward for exploring'},
};
export function nearbyPlace(x:number,z:number,gateOpen=false):PlaceId|null {
 if(mapLodgeNearby(x,z))return 'atlas';
 if(tournamentNearby(x,z))return 'duel';
 if(tradingPostNearby(x,z))return 'bargainy';
 if(workshopStationAt(x,z)!==null)return 'workshop';
 if(schoolhouseStationAt(x,z)!==null)return 'education';
 let best:PlaceId|null=null,distance=2.15;
 for(const [id,p] of Object.entries(places)) {
  if(id==='workshop'||id==='education'||id==='bargainy'||id==='duel'||id==='atlas')continue;
  if(id==='future'&&!gateOpen||id==='gate'&&gateOpen)continue;
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
 if(z>18&&x<9)return 'arrival';
 if(z<GATE_Z&&Math.abs(x)<9)return 'future';
 if(z<-11&&Math.abs(x)<4)return 'gate';
 let best:PlaceId='square',distance=8;
 for(const b of buildings){const d=Math.hypot(x-b.at[0],z-b.at[1]);if(d<distance){best=b.id;distance=d;}}
 return best==='square'&&z>9?'arrival':best;
}
export const trees: [number,number,number,number][] = [
 // Small trees in the gaps between homes, away from the walking lanes.
 [-17,7,.85,0],[18,23,.8,1],[27,-10,.9,0],
 [0,-1,1.8,1],[-.5,27,1.25,1],[8.5,28,1.2,0],[-.5,22,1.25,0],[8.5,22,1.3,1],
 [-5,14,1.15,1],[5,13,1.1,0],[-15,5.5,1.2,0],[-22,-7,1.25,1],[-17,-11,1.2,1],
 [-7,-13,1.3,1],[4,-14.5,1.1,0],[-4,-14.5,1.2,1],[12,-12,1.25,1],
 [18,20,1.3,0],[23,20,1.2,1],[29,21,1.2,0],[35,6,1.25,1],[37,-8,1.2,1],
 [-7,-22,1.3,0],[7,-23,1.4,1],[-8,-30,1.4,1],[8,-31,1.3,0],
];
// Staggered woodland fringe masks the world boundary; no new model downloads.
for(let i=0;i<42;i++){
 const a=i*Math.PI*2/42;
 trees.push([6+Math.cos(a)*(39+(i%3)*2),Math.sin(a)*(40+(i%4)),1.35+(i%4)*.12,i%2]);
}
export const fenceLines: {a:Vec2;b:Vec2}[] = [
 {a:[-29,33],b:[1.3,33]},{a:[6.7,33],b:[41,33]},
 {a:[-28,33],b:[-28,-34]},{a:[40,33],b:[40,-34]},
 {a:[-28,-34],b:[40,-34]},
 // The northern fence joins the perimeter so the locked garden cannot be bypassed.
 {a:[-29,GATE_Z],b:[-2.4,GATE_Z]},{a:[2.4,GATE_Z],b:[41,GATE_Z]},
 {a:[-10,17],b:[-3.5,17]},{a:[10,22],b:[16,22]},
 {a:[-24,8.5],b:[-19,8.5]},{a:[30,20.5],b:[37,20.5]},
];
// Hedge banks give the gate fence and outer boundary a visible, continuous edge.
export const hedges:Solid[]=[
 {p:[-15.7,1.1,GATE_Z-.6],s:[26.6,2.2,1.5]},
 {p:[21.7,1.1,GATE_Z-.6],s:[38.6,2.2,1.5]},
 {p:[-28.4,.95,0],s:[1.2,1.9,67]}, {p:[40.4,.95,0],s:[1.2,1.9,67]},
 {p:[6,.95,-34],s:[68,1.9,1.4]},
 {p:[-13.7,.9,33],s:[30,1.8,1.2]}, {p:[23.7,.9,33],s:[34,1.8,1.2]},
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
  for(const item of Object.values(workshopLayout))add(item.p,item.s);
 }else if(b.id==='bargainy'){for(const item of Object.values(tradingPostLayout))add(item.p,item.s);}
 else if(b.id==='atlas'){for(const item of Object.values(mapLodgeLayout))add(item.p,item.s);}
 else if(b.id==='education'){for(const item of Object.values(schoolhouseLayout))add(item.p,item.s);}
 else if(b.id==='smosh'){
  for(const item of Object.values(tavernLayout))add(item.p,item.s);
 }else if(b.id==='duel'){for(const item of Object.values(tournamentLayout))add(item.p,item.s);}
}
export const solids:Solid[]=[
 {p:[0,-.15,0],s:[140,.3,130]},...buildingSolids,...hedges,
 ...cottages.map(c=>({p:[c.at[0],2,c.at[1]] as Vec3,s:[c.width,4,c.depth] as Vec3,rotation:c.rotation})),
 ...trees.map(([x,z,s])=>({p:[x,1.7,z] as Vec3,s:[.65*s,3.4,.65*s] as Vec3})),
 // Low bench silhouettes around the landmark; the front crossing stays open.
 {p:[-1.8,.3,-1],s:[.5,.6,2.2]}, {p:[1.8,.3,-1],s:[.5,.6,2.2]},
 ...fenceLines.map(({a,b})=>({p:[(a[0]+b[0])/2,.65,(a[1]+b[1])/2] as Vec3,s:[Math.hypot(b[0]-a[0],b[1]-a[1]),1.3,.14] as Vec3,rotation:-Math.atan2(b[1]-a[1],b[0]-a[0])})),
 {p:[-3,.25,-29],s:[3,.5,3]}, {p:[3.5,.55,-29],s:[2,1.1,2]},
 {p:[6,.9,19],s:[.15,1.8,.15]},
 {p:[-2.6,1.6,GATE_Z],s:[.4,3.2,.4]}, {p:[2.6,1.6,GATE_Z],s:[.4,3.2,.4]},
 {p:[BOUNDS.left,3,0],s:[.5,6,70]}, {p:[BOUNDS.right,3,0],s:[.5,6,70]},
 {p:[6,3,BOUNDS.back],s:[71,6,.5]}, {p:[6,3,BOUNDS.front],s:[71,6,.5]},
];
