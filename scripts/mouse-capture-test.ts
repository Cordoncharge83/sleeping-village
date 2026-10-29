import assert from 'node:assert/strict';
import {MouseCaptureSession,type CaptureTarget} from '../src/mouse-capture.ts';
let lock:object|null=null;
const events:string[]=[];
const capture=new MouseCaptureSession(()=>lock,{waiting:()=>events.push('waiting'),ready:()=>events.push('ready'),failed:()=>events.push('failed')});
const tick=()=>new Promise(resolve=>setImmediate(resolve));

// A resolved request alone does not authorize movement if the cursor is still free.
const empty:CaptureTarget={requestPointerLock:()=>Promise.resolve()};
capture.request(empty);await tick();assert.deepEqual(events,['waiting']);
lock=empty;assert.equal(capture.sync(),true);assert.deepEqual(events,['waiting','ready']);
capture.sync();assert.equal(events.filter(e=>e==='ready').length,1,'Promise/event confirmations do not resume twice');
capture.cancel();lock=null;events.length=0;

// Escape can require a fresh gesture. The failed attempt stays out of play; retry can succeed.
let attempt=0;
const retry:CaptureTarget={requestPointerLock:()=>{if(attempt++===0)return Promise.reject(new DOMException('Click required','NotAllowedError'));lock=retry;return Promise.resolve();}};
capture.request(retry);await tick();assert.deepEqual(events,['waiting','failed']);
capture.request(retry);await tick();assert.deepEqual(events,['waiting','failed','waiting','ready']);
capture.cancel();lock=null;events.length=0;

// Older implementations signal capture solely through pointerlockchange.
const legacy:CaptureTarget={requestPointerLock:()=>{}};
capture.request(legacy);assert.deepEqual(events,['waiting']);capture.fail(new DOMException('Gesture needed','NotAllowedError'));assert.deepEqual(events,['waiting','failed']);lock=legacy;capture.sync();assert.deepEqual(events,['waiting','failed','ready']);
capture.cancel();lock=null;events.length=0;

// Returning to a menu invalidates a late result from an outstanding request.
let resolveLate!:()=>void;
const late:CaptureTarget={requestPointerLock:()=>new Promise<void>(resolve=>{resolveLate=resolve;})};
capture.request(late);capture.cancel();lock=late;resolveLate();await tick();assert.equal(capture.sync(),false);assert.deepEqual(events,['waiting']);
lock=null;events.length=0;
const broken:CaptureTarget={requestPointerLock:()=>{throw new DOMException('Embedded document','WrongDocumentError');}};
capture.request(broken);assert.deepEqual(events,['waiting','failed']);capture.cancel();events.length=0;
capture.request(null);assert.deepEqual(events,['waiting','failed']);capture.cancel();events.length=0;
lock=legacy;capture.request(legacy);assert.deepEqual(events,['ready'],'Already captured resumes immediately');
console.log('PASS: capture required before play, Escape denial/retry, promise and event APIs, duplicate events, cancelled requests, unsupported capture, and already-captured resume.');
