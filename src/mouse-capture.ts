export type CaptureTarget={requestPointerLock?:()=>Promise<void>|void};
type Callbacks={waiting:()=>void;ready:()=>void;failed:(error:unknown)=>void};

/** Mouse capture is confirmed by the browser, never assumed from a resume action. */
export class MouseCaptureSession{
 private generation=0;
 private target:CaptureTarget|null=null;
 private pending=false;
 private readonly readLock:()=>object|null;
 private readonly callbacks:Callbacks;
 constructor(readLock:()=>object|null,callbacks:Callbacks){this.readLock=readLock;this.callbacks=callbacks;}
 request(target:CaptureTarget|null){
  const generation=++this.generation;this.target=target;this.pending=true;
  if(this.sync())return;
  this.callbacks.waiting();
  const failed=(error:unknown)=>{if(generation===this.generation)this.fail(error);};
  if(!target?.requestPointerLock){failed(new DOMException('Mouse capture is unavailable','NotSupportedError'));return;}
  try{
   const promise=target.requestPointerLock();
   if(promise)promise.then(()=>{if(generation===this.generation)this.sync();},failed);
  }catch(error){failed(error);}
 }
 sync(){
  if(!this.target||this.readLock()!==this.target)return false;
  if(this.pending){this.pending=false;this.callbacks.ready();}
  return true;
 }
 fail(error:unknown){if(this.pending)this.callbacks.failed(error);}
 cancel(){++this.generation;this.target=null;this.pending=false;}
}
