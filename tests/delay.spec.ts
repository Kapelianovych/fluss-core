import { suite } from 'uvu';
import { fake, SinonSpy } from 'sinon';
import { instance, is, not, ok, type } from 'uvu/assert';

import { delay, FRAME_TIME } from '../src/index.js';

const FrameTime = suite('FRAME_TIME');

FrameTime('should be exported', () => {
  ok(FRAME_TIME);
});

FrameTime('should be close to 16.67', () => {
  is(FRAME_TIME, 16.67);
});

FrameTime.run();

const Delay = suite('delay');

Delay('should not invoke function immediately', () => {
  const fn = fake();

  delay(fn, 2);

  not(fn.called);
});

Delay('should invoke function after two frames', () => {
  const now = Date.now();

  delay(() => {
    // It is not precise tests.
    ok(Date.now() - now < FRAME_TIME * 3);
  }, 2);
});

Delay('should return delay object', () => {
  const id = delay(() => {});

  ok('result' in id);
  ok('canceled' in id);
  ok('cancel' in id);
  instance(id.result, Promise);
  type(id.canceled, 'boolean');
  type(id.cancel, 'function');
});

Delay(
  'should use requestAnimationFrame function when frames is set to 0',
  () => {
    globalThis.requestAnimationFrame = fake();

    delay(() => {}, 0);

    setTimeout(() => {
      ok((globalThis.requestAnimationFrame as unknown as SinonSpy).called);
    }, 100);
  },
);

Delay(
  'should use requestAnimationFrame function when frames is not defined',
  () => {
    globalThis.requestAnimationFrame = fake();

    delay(() => {});

    setTimeout(() => {
      ok((globalThis.requestAnimationFrame as unknown as SinonSpy).called);
    }, 100);
  },
);

Delay.run();

const CancelDelay = suite('cancelDelay');

CancelDelay('should cancel delayed function execution', () => {
  const fn = fake();

  delay(fn, 2).cancel();

  setTimeout(() => {
    not(fn.called);
  }, 3 * FRAME_TIME);
});

CancelDelay('should signal if delay if canceled', () => {
  const stamp = delay(() => {}, 2);

  not(stamp.canceled);

  stamp.cancel();

  ok(stamp.canceled);
});

CancelDelay('should return result from delayed function', async () => {
  const fn = () => 7;

  const { result } = delay(fn, 2);

  is(await result, 7);
});

CancelDelay('should not throw an error on twice cancel execution', () => {
  const stamp = delay(() => {}, 2);

  not.throws(() => stamp.cancel);
  not.throws(() => stamp.cancel);
  not.throws(() => stamp.cancel);
});

CancelDelay.run();
