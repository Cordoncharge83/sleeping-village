import React,{Component,Suspense,lazy,useCallback,useEffect,useRef,useState} from 'react';
import {DEFAULT_MOUSE_SENSITIVITY} from './tuning';
import {places,workshopStations,schoolhouseStations,type PlaceId} from './village';
import {entries,isEntryId,discoveryCount,hasAllDiscoveries,type EntryId} from './journal-data';
import {discover,decodeDiscoveries,DISCOVERY_KEY,saveDiscoveries} from './discoveries';
import Journal from './Journal';
import {Modal,BookIcon} from './Modal';
const Game=lazy(()=>import('./Game'));
class ErrorBoundary extends Component<{children:React.ReactNode},{error:string}>{
 state={error:''};static getDerivedStateFromError(e:Error){return {error:e.message};}
 render(){return this.state.error?<div className="fatal"><h2>The village couldn’t load.</h2><p>{this.state.error}</p><button onClick={()=>location.reload()}>Try again</button></div>:this.props.children;}
}
type Mode='welcome'|'play'|'pause'|'settings'|'place'|'journal'|'map';
function readSaved(){try{return {entries:decodeDiscoveries(window.localStorage.getItem(DISCOVERY_KEY)),available:true};}catch{return {entries:[],available:false};}}
export default function App(){
 const [ready,setReady]=useState(false),[mode,setMode]=useState<Mode>('welcome');
 const [displayPage,setDisplayPage]=useState(0),[initialPage,setInitialPage]=useState(0);
 const [near,setNear]=useState<PlaceId|null>(null),[area,setArea]=useState<PlaceId|'arrival'>('arrival');
 const [low,setLow]=useState(false),[sensitivity,setSensitivity]=useState(DEFAULT_MOUSE_SENSITIVITY),[reset,setReset]=useState(0),[error,setError]=useState('');
 const [saved]=useState(readSaved);
 const [discovered,setDiscovered]=useState<EntryId[]>(saved.entries),[storageAvailable,setStorageAvailable]=useState(saved.available),[newEntry,setNewEntry]=useState<string|null>(null);
 const discoveredRef=useRef(discovered);
 const count=discoveryCount(discovered),gateOpen=hasAllDiscoveries(discovered);
 const [journalOrigin,setJournalOrigin]=useState<Mode>('play'),[initialEntry,setInitialEntry]=useState<EntryId|null>(null),[revealAll,setRevealAll]=useState(false);
 const onReady=useCallback(()=>setReady(true),[]),onNear=useCallback((v:PlaceId|null,page:number)=>{setNear(v);setDisplayPage(page);},[]),onArea=useCallback((v:PlaceId|'arrival')=>setArea(v),[]),onError=useCallback((v:string)=>setError(v),[]);
 const enter=()=>{setMode('play');const c=document.querySelector('canvas');try{const p=c?.requestPointerLock();if(p&&'catch' in p)p.catch(()=>{});}catch{/* Right-drag remains available. */}};
 const openJournal=(all=false,id:EntryId|null=null,page=0)=>{setInitialPage(page);setJournalOrigin(mode);setRevealAll(all);setInitialEntry(id);setNewEntry(null);setMode('journal');};
 const closeJournal=()=>{if(journalOrigin==='play')enter();else setMode(journalOrigin);};
 const inspect=()=>{
  if(!near||near==='future'&&!gateOpen)return;
  if(!isEntryId(near)){setMode('place');return;}
  const result=discover(discoveredRef.current,near),opensGate=!hasAllDiscoveries(discoveredRef.current)&&hasAllDiscoveries(result.entries);openJournal(false,near,near==='workshop'||near==='education'?displayPage:0);
  if(result.added){discoveredRef.current=result.entries;setDiscovered(result.entries);setNewEntry(entries[near].title+(opensGate?' · The garden gate is now open.':''));try{setStorageAvailable(saveDiscoveries(window.localStorage,result.entries));}catch{setStorageAvailable(false);}}
 };
 useEffect(()=>{if(mode!=='play'&&document.pointerLockElement)document.exitPointerLock();},[mode]);
 useEffect(()=>{if(!newEntry)return;const timer=window.setTimeout(()=>setNewEntry(null),6500);return()=>clearTimeout(timer);},[newEntry]);
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{
   if(e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;
   if(e.code==='Escape'){if(mode==='play'){e.preventDefault();setMode('pause');}else if(mode==='map'){e.preventDefault();enter();}}
   if(e.code==='KeyE'&&mode==='play'&&near){e.preventDefault();inspect();}
   if(e.code==='KeyJ'&&['play','pause','map','welcome','journal'].includes(mode)){e.preventDefault();if(mode==='journal')closeJournal();else openJournal();}
   if(e.code==='KeyM'&&ready&&(mode==='play'||mode==='map')){e.preventDefault();if(mode==='map')enter();else setMode('map');}
  };
  const lock=()=>{if(!document.pointerLockElement)setMode(m=>m==='play'?'pause':m);};
  const blur=()=>setMode(m=>m==='play'?'pause':m);
  window.addEventListener('keydown',key);document.addEventListener('pointerlockchange',lock);window.addEventListener('blur',blur);
  return()=>{window.removeEventListener('keydown',key);document.removeEventListener('pointerlockchange',lock);window.removeEventListener('blur',blur);};
 });
 const location=area==='arrival'?places.welcome:area==='gate'&&gateOpen?{...places.gate,hint:'The garden is open. Step through to discover what comes next.'}:places[area];
 const notice=places[near??'square'];
 return <main>
  <div className="world"><ErrorBoundary><Suspense fallback={null}><Game active={mode==='play'} overview={mode==='map'} sensitivity={sensitivity} low={low} reset={reset} gateOpen={gateOpen} discoveryCount={count} onNear={onNear} onArea={onArea} onReady={onReady} onError={onError}/></Suspense></ErrorBoundary></div>
  <header className="game-hud"><button className="village-mark" onClick={()=>setMode('welcome')} aria-label="Main menu"><span aria-hidden="true">✦</span> The Sleeping Village</button><nav aria-label="Game controls"><button className="journal-shortcut" onClick={()=>openJournal()}><BookIcon/><span>Journal<small>{count} / 6 discovered</small></span><kbd>J</kbd></button><button className="hud-button" disabled={!ready} onClick={()=>setMode('map')}><kbd>M</kbd> Map</button><button className="hud-button" disabled={!ready} onClick={()=>setMode('pause')} aria-label="Pause game">Ⅱ</button></nav></header>
  {mode==='welcome'&&<section className="welcome game-menu" aria-label="Main menu"><span className="eyebrow">A TRAVELER’S TALE</span><h1>The Sleeping<br/>Village</h1><p>Projects, stories, and a few ideas<br/>waiting along the woodland path.</p><div className="menu-choices"><button className="paper-button" disabled={!ready||!!error} onClick={enter}>{error?'Unable to load':ready?'Enter the village':'Preparing the village…'} <span>→</span></button><button onClick={()=>openJournal()}>Open my journal <kbd>J</kbd></button><button onClick={()=>openJournal(true)}>Browse all projects <span>↗</span></button></div><small className="menu-footnote">Prefer to skip the walk? Every project is open above.</small>{error&&<p role="alert">{error}</p>}</section>}
  {mode==='play'&&ready&&<><div className="location"><span className="eyebrow">YOU ARE HERE</span><h2>{location.title}</h2><p>{location.hint}</p></div>{near&&<button className="interact" onClick={inspect}><kbd>E</kbd><span>{near==='gate'?'Read the garden gate':near==='welcome'?'Read the welcome sign':near==='square'?'Read the village notice':near==='smosh'?'Open the story ledger':near==='bargainy'?'Read the negotiation notebook':near==='duel'?'Read the organiser’s ledger':near==='atlas'?'Read the scouting ledger':near==='workshop'?workshopStations[displayPage].prompt:near==='education'?schoolhouseStations[displayPage].prompt:`Inspect ${places[near].title.toLowerCase()}`}<small>{isEntryId(near)?discovered.includes(near)?'Revisit journal entry':'Add a story to your journal':near==='gate'?`${count} / 6 village stories discovered`:'Find your way around'}</small></span></button>}<div className="reticle"/><div className="controls"><span><kbd>W A S D</kbd> Walk</span><span><kbd>SHIFT</kbd> Run</span><span>Mouse · Look</span><span><kbd>J</kbd> Journal</span><span><kbd>ESC</kbd> Pause</span></div></>}
  {mode==='map'&&ready&&<section className="map-legend parchment" aria-label="Village overview"><span className="eyebrow">A NOTE FOR THE ROAD</span><h2>The village paths</h2><p>The old tree joins the streets. Projects lie east; the workshop and schoolhouse lie west.</p><ul>{Object.entries(entries).map(([id,entry])=><li key={id}>{entry.place}<small>{id==='future'?(gateOpen?'✦ Garden gate open':'Beyond the gate · find six stories'):discovered.includes(id as EntryId)?'✦ Written in your journal':'A story to discover'}</small></li>)}</ul><button className="ink-button" onClick={enter}>Return to the path <kbd>M</kbd></button></section>}
  {mode==='journal'&&<Journal discovered={discovered} initialEntry={initialEntry} initialPage={initialPage} revealAll={revealAll} onClose={closeJournal} storageAvailable={storageAvailable} newEntry={newEntry}/>}
  {mode==='pause'&&<Modal label="Game paused" onClose={enter} className="cover-modal"><div className="leather-cover"><span className="eyebrow">THE SLEEPING VILLAGE</span><BookIcon/><h2>A moment of quiet</h2><p>Your place on the path is kept.</p><div className="menu-choices"><button autoFocus className="paper-button" onClick={enter}>Continue the journey <span>→</span></button><button onClick={()=>openJournal()}>Traveler’s journal <kbd>J</kbd></button><button onClick={()=>setMode('settings')}>Settings <span>⚙</span></button><button onClick={()=>setMode('map')}>Village map <span>◇</span></button><button onClick={()=>openJournal(true)}>Browse all projects <span>↗</span></button><a href="https://portfolio.moudka.com/">Back to portfolio <span aria-hidden="true">↗</span></a></div><div className="cover-footer"><button onClick={()=>{setReset(v=>v+1);enter();}}>Return to entrance</button><button onClick={()=>setMode('welcome')}>Main menu</button></div><small>ESC · Return to the journey</small></div></Modal>}
  {mode==='settings'&&<Modal label="Game settings" onClose={()=>setMode('pause')} className="note-modal"><section className="parchment settings"><span className="eyebrow">MAKE YOURSELF AT HOME</span><h2>A few adjustments</h2><label>Mouse sensitivity <output>{Math.round(sensitivity*100)}%</output><input aria-label="Mouse sensitivity" type="range" min=".3" max="2" step=".1" value={sensitivity} onChange={e=>setSensitivity(Number(e.target.value))}/></label><label className="check"><input type="checkbox" checked={low} onChange={e=>setLow(e.target.checked)}/><span>Low graphics<small>Lower resolution, no shadows</small></span></label><p className="page-note">If the mouse isn’t captured, hold the right mouse button to look around.</p><button autoFocus className="ink-button" onClick={()=>setMode('pause')}>Back to pause menu <span>←</span></button></section></Modal>}
  {mode==='place'&&<Modal label={notice.title} onClose={enter} className="note-modal"><section className="parchment village-notice"><span className="eyebrow">{near==='gate'?`${count} / 6 VILLAGE STORIES`:notice.status}</span><h2>{notice.title}</h2><p>{notice.description}</p><p>Look for open fronts and warm lanterns. Press <kbd>E</kbd> to inspect their displays, and <kbd>J</kbd> to read your journal.</p><button autoFocus className="ink-button" onClick={enter}>Back to exploring <span>→</span></button><button className="text-button" onClick={()=>openJournal(true)}>Browse all projects without exploring</button></section></Modal>}
  <footer className="game-footer"><span>MOUADH BONDKA · A PORTFOLIO TO EXPLORE</span><button onClick={()=>openJournal(true)}>All projects ↗</button></footer>
 </main>;
}
