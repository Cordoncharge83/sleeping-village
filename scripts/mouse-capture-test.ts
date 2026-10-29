import assert from 'node:assert/strict';
import {MouseCaptureSession,type CaptureTarget} from '../src/mouse-capture.ts';
let lock:object|null=null;
const capture=new MouseCaptureSession(()=>lock);
const tick=()=>new Promise(resolve=>setImmediate(resolve));

// A denied Escape request can retry from the next ordinary input gesture.
let attempts=0;
const retry:CaptureTarget={requestPointerLock:()=>{
 if(attempts++===0)return Promise.reject(new DOMException('Gesture needed','NotAllowedError'));
 lock=retry;return Promise.resolve();
}};
capture.request(retry);await tick();assert.equal(capture.sync(),false);
capture.request(retry);await tick();assert.equal(capture.sync(),true);assert.equal(attempts,2);
capture.request(retry);assert.equal(attempts,2,'An already captured canvas is not requested again');
capture.cancel();lock=null;

// Rapid keyboard/click input must not stack native requests while one is pending.
let resolvePending!:()=>void;
attempts=0;
const pending:CaptureTarget={requestPointerLock:()=>{attempts++;return new Promise<void>(resolve=>{resolvePending=resolve;});}};
capture.request(pending);capture.request(pending);assert.equal(attempts,1);
lock=pending;resolvePending();await tick();assert.equal(capture.sync(),true);
capture.cancel();lock=null;

// Legacy browsers use pointerlockerror and pointerlockchange instead of a promise.
attempts=0;
const legacy:CaptureTarget={requestPointerLock:()=>{attempts++;}};
capture.request(legacy);capture.fail();capture.request(legacy);assert.equal(attempts,2);
lock=legacy;assert.equal(capture.sync(),true);assert.equal(capture.sync(),true);
capture.cancel();lock=null;

// Returning to menus invalidates late completion; it never resumes gameplay.
capture.request(pending);capture.cancel();lock=pending;resolvePending();await tick();assert.equal(capture.sync(),false);
lock=null;

// A stale rejection must not clear a newer request's pending guard.
let rejectOld!:(reason:unknown)=>void;
const old:CaptureTarget={requestPointerLock:()=>new Promise<void>((_,reject)=>{rejectOld=reject;})};
capture.request(old);capture.cancel();attempts=0;capture.request(pending);
rejectOld(new DOMException('Old failure','NotAllowedError'));await tick();capture.request(pending);
assert.equal(attempts,1);capture.cancel();resolvePending();await tick();

// Unsupported or embedded browsers cannot throw into the game loop or trap menus.
attempts=0;
const broken:CaptureTarget={requestPointerLock:()=>{attempts++;throw new DOMException('Embedded document','WrongDocumentError');}};
assert.doesNotThrow(()=>capture.request(broken));capture.request(broken);assert.equal(attempts,2);
assert.doesNotThrow(()=>capture.request(null));assert.equal(capture.sync(),false);
capture.cancel();
console.log('PASS: immediate resume capture retries, pending deduplication, promise and event APIs, cancelled requests, stale failures, and unsupported browsers.');