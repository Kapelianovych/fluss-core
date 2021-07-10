import { memoize } from '../src';

describe('memoize', () => {
  it('should memoize functions results and per key invoke function only once', () => {
    const fn = jest.fn((num: number) => num * 3);
    const fnWithCache = memoize(fn);

    const result1 = fnWithCache(1);
    const result2 = fnWithCache(2);
    const result3 = fnWithCache(3);
    const result4 = fnWithCache(3);

    expect(result1).toBe(3);
    expect(result2).toBe(6);
    expect(result3).toBe(9);
    expect(result4).toBe(9);
    expect(fn).toBeCalledTimes(3);
  });

  it('it should return cached result for the same argument', () => {
    const fn = jest.fn((num: number) => Math.random() * num);
    const cachedFn = memoize(fn);

    const result1 = cachedFn(1);
    const result2 = cachedFn(2);
    const result3 = cachedFn(1);

    expect(result1).toBe(result3);
    expect(result1).not.toBe(result2);
  });

  it('should use second parameter to get key', () => {
    const fn = jest.fn((num: number) => Math.random() * num);
    const keyFrom = jest.fn((num: number) => num);
    const cachedFn = memoize(fn, keyFrom);

    cachedFn(1);
    cachedFn(2);
    cachedFn(1);

    expect(keyFrom).toBeCalledTimes(3);
    expect(keyFrom).nthReturnedWith(1, 1);
    expect(keyFrom).nthReturnedWith(2, 2);
    expect(keyFrom).nthReturnedWith(3, 1);
  });

  it('should expose cache object outside', () => {
    const memo = memoize((n: number) => {});

    expect(typeof memo.cache).toBe('object');
    expect(memo.cache instanceof Map).toBe(true);
  });

  it('should allow clearing cache', () => {
    const fn = jest.fn((n: number) => n);
    const memoFn = memoize(fn);

    memoFn(1);
    expect(fn).toBeCalled();
    fn.mockClear();

    memoFn(1);
    expect(fn).not.toBeCalled();
    fn.mockClear();

    memoFn.cache.clear();
    memoFn(1);
    expect(fn).toBeCalled();
  });
});
