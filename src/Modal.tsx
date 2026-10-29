import {useEffect,useRef,type KeyboardEvent,type ReactNode} from 'react';
export function BookIcon(){return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 10c-5-4-11-4-16-2v25c6-2 11-2 16 2 5-4 10-4 16-2V8c-5-2-11-2-16 2Z" stroke="currentColor" strokeWidth="2"/><path d="M20 10v25M8 14c3-1 5 0 8 1M8 20c3-1 5 0 8 1M24 15c3-1 5-2 8-1M24 21c3-1 5-2 8-1" stroke="currentColor" strokeWidth="1.5"/></svg>;}
export function Modal({children,onClose,label,className=''}:{children:ReactNode;onClose:()=>void;label:string;className?:string}){
 const ref=useRef<HTMLDialogElement>(null),closing=useRef(false);
 const closeOnce=()=>{if(!closing.current){closing.current=true;onClose();}};
 useEffect(()=>{const d=ref.current!;d.showModal();return()=>d.close();},[]);
 function containTab(e:KeyboardEvent<HTMLDialogElement>){
  // Consume Escape here so the same key cannot close this dialog and pause play.
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(!e.repeat)closeOnce();return;}
  if(e.key!=='Tab')return;
  const controls=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(el=>el.getClientRects().length>0);
  const first=controls[0],last=controls[controls.length-1];
  if(!first){e.preventDefault();return;}
  if(e.shiftKey&&(document.activeElement===first||document.activeElement===e.currentTarget)){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
 return <dialog ref={ref} className={`modal-surface ${className}`} aria-label={label} onKeyDown={containTab} onCancel={e=>{e.preventDefault();e.stopPropagation();closeOnce();}}>{children}</dialog>;
}
