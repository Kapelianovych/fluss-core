import { is } from 'uvu/assert';
import { fake } from 'sinon';
import { suite } from 'uvu';

import { debounce, FRAME_TIME } from '../src/index.js';

const defer = async (callback: VoidFunction, time: number) =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      callback();
      resolve();
    }, time),
  );

const Debounce = suite('debounce');

Debounce(
  'should not run function with interval lower than defined frame',
  async () => {
    const fn = fake();
    const bounced = debounce(fn, 2);

    bounced();
    bounced();
    bounced();
    bounced();
    bounced();
    bounced();

    await defer(() => is(fn.callCount, 1), FRAME_TIME * 2);
  },
);

Debounce('should run function after interval expires', async () => {
  const fn = fake();
  const bounced = debounce(fn, 2);

  bounced();

  await defer(bounced, FRAME_TIME * 2);

  await defer(() => is(fn.callCount, 2), FRAME_TIME * 5);
});

Debounce.run();
