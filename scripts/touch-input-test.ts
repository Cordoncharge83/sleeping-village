import assert from 'node:assert/strict';
import {TouchInput} from '../src/touch-input.ts';

const input = new TouchInput();
input.move(.05, -.05);
assert.equal(Math.hypot(input.x, input.z), 0);

input.move(0, -.45);
assert.ok(input.z < 0 && input.z > -1);
assert.equal(input.running, false);
input.move(3, 4);
assert.equal(input.x, .6);
assert.equal(input.z, .8);
assert.equal(input.running, true);

input.move(0, .85);
assert.equal(input.running, true);
input.move(0, .75);
assert.equal(input.running, false);
input.lookX = 42;
input.lookY = -18;
input.reset();
assert.deepEqual(input, new TouchInput());
console.log('PASS: touch dead zone, analog movement, diagonal speed cap, run thresholds and interrupted input.');
