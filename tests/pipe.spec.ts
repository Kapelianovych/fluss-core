import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';

import { pipe } from '../src/index.js';

const Pipe = suite('pipe');

Pipe('should compose two functions and return a function.', () => {
  const composedFn = pipe(
    (n: number) => `${n} is number`,
    (n: string) => n + '!',
  );

  is(composedFn(9), '9 is number!');
});

Pipe('should compose asynchronous functions.', async () => {
  const composed = pipe(
    async (s: string) => s,
    async (s: string) => parseInt(s),
  );

  is(await composed('1'), 1);
});

Pipe('should compose synchronous and asynchronous functions.', async () => {
  const composed = pipe(
    async (s: string) => s,
    (s: string) => parseInt(s, 10),
  );

  is(await composed('1'), 1);
});

Pipe(
  'should compose functions with one mandatory parameter and with variadic parameter',
  () => {
    const composed = pipe(
      (n: number) => n,
      (...args: readonly number[]) => args.reduce((a, c) => a + c, 0),
    );

    is(composed(1), 1);
  },
);

Pipe.run();
