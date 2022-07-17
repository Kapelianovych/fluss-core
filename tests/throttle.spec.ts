import { fake } from 'sinon';
import { suite } from 'uvu';
import { ok, unreachable } from 'uvu/assert';

import { throttle } from '../src/index.js';

const Throttle = suite('throttle');

Throttle('should execute function immediately by default', async () => {
  const now = Date.now();

  await new Promise<void>((resolve) => {
    throttle(() => {
      try {
        ok(Date.now() - now < 1);
        resolve();
      } catch (error) {
        unreachable();
      }
    })();
  });
});

Throttle(
  'should block other executions that goes right after first execution',
  () => {
    const fakeFunction = fake();

    const throttledFunction = throttle(fakeFunction, 2);

    throttledFunction();
    throttledFunction();
    throttledFunction();

    ok(fakeFunction.calledOnce);
  },
);

Throttle.run();
