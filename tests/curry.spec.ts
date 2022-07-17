import { suite } from 'uvu';
import { is, type, equal } from 'uvu/assert';

import { curry, _ } from '../src/index.js';

const Curry = suite('curry');

Curry('should curry function with two arguments', () => {
  const curriedFn = curry((n: number, a: number) => a + n);

  type(curriedFn, 'function');
  type(curriedFn(8), 'function');
  is(curriedFn(8)(8), 16);
  is(curriedFn(8, 8), 16);
});

Curry('should discard excessive arguments', () => {
  const curried = curry((f: number, s: number) => f + s);

  // @ts-expect-error
  is(curried(1, 2, 3), 3);
  // @ts-expect-error
  is(curried(1)(2, 3), 3);
});

Curry('should preserve parameters if placeholder is provide', () => {
  const fn = curry((value: number) => value);

  const curriedFn = fn(_);

  type(curriedFn(), 'function');
});

Curry(
  'should preserve place for argument in the middle of parameters list',
  () => {
    const curried = curry((n: number, s: string, b: boolean) => (b ? n : s));

    const fn = curried(9, _, false);

    type(fn, 'function');
    is(fn('ho'), 'ho');
  },
);

Curry('should preserve place in the start of parameters list', () => {
  const curried = curry((n: number, s: string) => n + s);

  const fn = curried(_, '');

  type(fn, 'function');
  is(fn(12), '12');
});

Curry('should correctly infer types for two or more gaps', async () => {
  const sendData = (
    href: string,
    method: string,
    data: string,
  ): Promise<string> => Promise.resolve(href + method + data);

  const curriedFn = curry(sendData)(_, _, 'data');

  is(await curriedFn('h', 'p'), 'hpdata');
});

Curry('should preserve correct types for function parameters', () => {
  const sendData = (
    href: string,
    method: number,
    body: object,
    ...headers: Record<string, string>[]
  ): string =>
    href +
    String(method) +
    JSON.stringify(body) +
    headers.map((value) => JSON.stringify(value));

  const curriedSendData = curry(sendData);

  const sendDataWithHref = curriedSendData('/endpoint/data');
  type(sendDataWithHref, 'function');

  const sendDataWithHrefAndMethod = curriedSendData(
    '/endpoint/data',
    1,
  );
  type(sendDataWithHrefAndMethod, 'function');
  type(sendDataWithHrefAndMethod({}), 'string');
});

Curry(
  'should return a function with the same parameters when all arguments were the placeholder',
  async () => {
    const sendData = (
      href: string,
      method: string,
      data: string,
    ): Promise<string> => Promise.resolve(href + method + data);

    const curriedFn = curry(sendData)(_, _, _);

    is(await curriedFn('h', 'p', 'data'), 'hpdata');
  },
);

Curry('should define arity for function with only variadic parameter', () => {
  // For ReadonlyArray<number>|readonly number[]
  // [there is a bug](https://github.com/microsoft/TypeScript/issues/37193),
  // so we should review it again in TypeScript ~v4.4.1
  const testFn = (...args: number[]) => args;

  const curried = curry(testFn, 3);

  const fn = curried();

  type(fn, 'function');

  const fn1 = fn(1, 4);
  type(fn1, 'function');

  const result = fn1(5);
  equal(result, [1, 4, 5]);
});

Curry('should not count variadic parameters by default', () => {
  const testFn = (s: string, ...numbers: readonly number[]) =>
    s + numbers.join('');
  const curried = curry(testFn);

  const fn = curried();

  is(fn('0'), '0');
  // @ts-expect-error
  is(fn('0', 1, 2, 3), '0');
});

Curry(
  'should handle function with fixed and variadic parameters and apparent arity',
  () => {
    const testFn = (s: string, ...numbers: readonly number[]) =>
      s + numbers.join('');
    const curried = curry(testFn, 3);

    const fn = curried();

    type(fn('0', 1), 'function');
    is(fn('0', 1, 2), '012');
  },
);

Curry.run();
