export type CaptureTarget={requestPointerLock?:()=>Promise<void>|void};
/** Best-effort native capture. Menus and ordinary mouse-look never wait on it. */
export class MouseCaptureSession{
 private generation=0;
 private target:CaptureTarget|null=null;
 private pending=false;
 private readonly readLock:()=>object|null;
 constructor(readLock:()=>object|null){this.readLock=readLock;}
 request(target:CaptureTarget|null){
  if(this.pending&&this.target===target)return;
  const generation=++this.generation;this.target=target;this.pending=true;
  if(this.sync())return;
  const failed=()=>{if(generation===this.generation)this.fail();};
  if(!target?.requestPointerLock){failed();return;}
  try{
   const promise=target.requestPointerLock();
   if(promise)promise.then(()=>{if(generation===this.generation)this.sync();},failed);
  }catch{failed();}
 }
 sync(){
  if(!this.target||this.readLock()!==this.target)return false;
  this.pending=false;
  return true;
 }
 fail(){this.pending=false;}
 cancel(){++this.generation;this.target=null;this.pending=false;}
}
