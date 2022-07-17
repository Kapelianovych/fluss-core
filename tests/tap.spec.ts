import { fake } from 'sinon';
import { suite } from 'uvu';
import { is, ok } from 'uvu/assert';

import { awaitedTap, tap } from '../src/index.js';

const Tap = suite('tap');

Tap('should not change value', () => {
  const value = 5;

  is(tap((_number: number) => {})(value), value);
});

Tap('should not wait for end of asynchronous function', () => {
  let testVariable = '';
  const value = 5;

  const effect = (_number: number) =>
    new Promise<void>((resolve) =>
      setTimeout(() => ((testVariable = 'filled'), resolve())),
    );

  tap(effect)(value);

  is(testVariable, '');
});

Tap('awaitedTap should wait until an effect finishes work', async () => {
  const effect = fake(
    (n: number) => new Promise<void>((resolve) => setTimeout(resolve, 500)),
  );

  const result = await awaitedTap(effect)(8);

  ok(effect.calledOnce);
  is(result, 8);
});

Tap.run();
