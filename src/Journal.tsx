import {useEffect,useRef,useState,type KeyboardEvent} from 'react';
import {entries,entryIds,type EntryId} from './journal-data';
import {Modal,BookIcon} from './Modal';
type Props={discovered:EntryId[];initialEntry:EntryId|null;revealAll:boolean;onClose:()=>void;storageAvailable:boolean;newEntry:string|null};
export default function Journal({discovered,initialEntry,revealAll,onClose,storageAvailable,newEntry}:Props){
 const [selected,setSelected]=useState<EntryId|null>(initialEntry),[page,setPage]=useState(0);
 const readingPage=useRef<HTMLElement>(null),previousSelection=useRef(selected);
 useEffect(()=>{
  const focused=document.activeElement;
  if(previousSelection.current!==selected||(selected&&(focused===document.body||(focused instanceof HTMLButtonElement&&focused.disabled))))readingPage.current?.focus({preventScroll:true});
  previousSelection.current=selected;
 },[selected,page]);
 const unlocked=(id:EntryId)=>revealAll||discovered.includes(id);
 const entry=selected&&unlocked(selected)?entries[selected]:null;
 const current=entry?.pages[page]??null;
 function choose(id:EntryId|null){setSelected(id);setPage(0);}
 function turn(direction:number){if(entry)setPage(p=>Math.max(0,Math.min(entry.pages.length-1,p+direction)));}
 function keys(e:KeyboardEvent){if(!entry)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turn(e.key==='ArrowRight'?1:-1);}}
 return <Modal onClose={onClose} label={revealAll?'Portfolio journal':'Traveler’s journal'} className="journal-modal">
  <div className="journal-shell" onKeyDown={keys}>
   <div className="journal-heading"><span>{revealAll?'THE COMPLETE COLLECTION':'THE TRAVELER’S JOURNAL'}</span><button className="close-book" autoFocus onClick={onClose} aria-label="Close journal">×</button></div>
   <nav className="bookmarks" aria-label="Journal navigation"><button onClick={()=>choose(null)} aria-pressed={!selected} className={!selected?'active':''}>Contents</button></nav>
   <div className="open-book">
    <section className="book-page left-page">
     <div className="page-topline">{entry?revealAll?'A page from the village':'A place discovered':'Notes from the village'}</div>
     <h1>{entry?entry.place:'The traveler’s journal'}</h1>
     {entry?<>
      {selected==='smosh'?<figure className="pinned-photo"><img src="/images/smosh/episode.png" alt="Smosh Story Finder episode card with a timestamped video link"/><figcaption>A story, found again.</figcaption></figure>:<div className="entry-emblem"><BookIcon/><span>{entry.summary}</span></div>}
      <div className="journal-stamp">{entry.status}</div><p className="entry-title">{entry.title}</p>
      {entry.link&&<a className="wax-button" href={entry.link} target="_blank" rel="noopener noreferrer">Visit the live archive <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>}
      {selected==='smosh'&&<small className="page-note">Independent fan-made project. Smosh and its branding belong to their respective owners.</small>}
     </>:<>
      <div className="journal-crest"><BookIcon/><span>Mouadh Bondka</span><small>Software engineer & maker</small></div>
      <p>{revealAll?'A collection of my projects, professional experience, and ideas for what comes next. Every entry is open here.':'Every place has a story. Inspect the objects you find along the path to add their stories to these pages.'}</p>
      <div className="journal-stamp">{revealAll?'All entries open':`${discovered.length} / ${entryIds.length} places discovered`}</div>
      <p className="page-note">{revealAll?'Browse freely. Your exploration journal stays separate.':storageAvailable?'Your discoveries are saved in this browser.':'Your browser cannot save discoveries right now. They will remain available during this visit.'}</p>
     </>}
     <span className="page-number">{entry?'I':'For the road ahead'}</span>
    </section>
    <section ref={readingPage} tabIndex={-1} className="book-page right-page" aria-label="Journal entry pages">
     {!entry?<>
      <div className="page-topline">{revealAll?'Choose an entry':'Places & their stories'}</div><h2>Contents</h2>
      <ol className="journal-index">{entryIds.map((id,i)=><li key={id}>
       {unlocked(id)?<button onClick={()=>choose(id)}><span className="index-number">{String(i+1).padStart(2,'0')}</span><span><strong>{entries[id].title}</strong><small>{entries[id].place}</small></span><span aria-hidden="true">›</span></button>:<div className="locked-entry"><span className="index-number">?</span><span><strong>Unwritten entry</strong><small>{entries[id].clue}</small></span></div>}
      </li>)}</ol><p className="page-note">{revealAll?'Smosh includes the first complete showcase. More images and project details will follow.':'Walk up to a point of interest and press E. Open this journal again with J.'}</p>
     </>:<>
      <div className="page-topline">{entry.title}</div><div key={`${selected}-${page}`} className="page-copy"><h2>{current!.heading}</h2>
       {current!.image&&<figure className="gallery-image"><a href={current!.image} target="_blank" rel="noopener noreferrer" aria-label="Enlarge screenshot in a new tab"><img src={current!.image} alt={current!.alt}/></a><figcaption>{current!.caption} · Select to enlarge</figcaption></figure>}
       {current!.paragraphs.map(p=><p key={p}>{p}</p>)}
      </div>
      <nav className="page-turner" aria-label="Turn entry pages"><button disabled={page===0} onClick={()=>turn(-1)} aria-label="Previous page">‹</button><span aria-live="polite">{current!.tab} · {page+1} / {entry.pages.length}</span><button disabled={page===entry.pages.length-1} onClick={()=>turn(1)} aria-label="Next page">›</button></nav>
     </>}
    </section>
   </div>
   <div className="journal-controls"><span><kbd>← →</kbd> Turn page</span><span><kbd>J</kbd> / <kbd>ESC</kbd> Close journal</span>{newEntry&&<span className="discovery-inline" role="status">✦ Entry added: {newEntry}</span>}</div>
  </div>
 </Modal>;
}
