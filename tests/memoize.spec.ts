import { fake } from 'sinon';
import { suite } from 'uvu';
import { instance, is, not, ok, type } from 'uvu/assert';

import { memoize } from '../src/index.js';

const Memoize = suite('memoize');

Memoize(
  'should memoize functions results and per key invoke function only once',
  () => {
    const fn = fake((num: number) => num * 3);
    const fnWithCache = memoize(fn);

    const result1 = fnWithCache(1);
    const result2 = fnWithCache(2);
    const result3 = fnWithCache(3);
    const result4 = fnWithCache(3);

    is(result1, 3);
    is(result2, 6);
    is(result3, 9);
    is(result4, 9);
    is(fn.callCount, 3);
  },
);

Memoize('it should return cached result for the same argument', () => {
  const fn = fake((num: number) => Math.random() * num);
  const cachedFn = memoize(fn);

  const result1 = cachedFn(1);
  const result2 = cachedFn(2);
  const result3 = cachedFn(1);

  is(result1, result3);
  is.not(result1, result2);
});

Memoize('should use the second parameter to get a key', () => {
  const fn = fake((num: number) => Math.random() * num);
  const keyFrom = fake((num: number) => num);
  const cachedFn = memoize(fn, keyFrom);

  cachedFn(1);
  cachedFn(2);
  cachedFn(1);

  ok(fn.calledTwice);
  ok(keyFrom.calledThrice);
  ok(keyFrom.getCall(0).returned(1));
  ok(keyFrom.getCall(1).returned(2));
  ok(keyFrom.getCall(2).returned(1));
});

Memoize('should expose cache object outside', () => {
  const memo = memoize((n: number) => {});

  type(memo.cache, 'object');
  instance(memo.cache, Map);
});

Memoize('should allow clearing cache', () => {
  const fn = fake((n: number) => n);
  const memoFn = memoize(fn);

  memoFn(1);
  ok(fn.called);
  fn.resetHistory();

  memoFn(1);
  not(fn.called);
  fn.resetHistory();

  memoFn.cache.clear();
  memoFn(1);
  ok(fn.called);
});

Memoize.run();
