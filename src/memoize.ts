import { NArray } from './utilities';

type WithCache<
  F extends (...args: ReadonlyArray<any>) => any,
  K extends (...args: Parameters<F>) => any = (
    ...args: Parameters<F>
  ) => NArray.First<Parameters<F>>
> = F & {
  readonly cache: Map<ReturnType<K>, ReturnType<F>>;
};

/**
 * Wraps function and cache all execution results.
 * Allows to customize key for cache. By default, it
 * is first function's argument.
 */
export const memoize = <
  F extends (...args: ReadonlyArray<any>) => any,
  K extends (...args: Parameters<F>) => any = (
    ...args: Parameters<F>
  ) => NArray.First<Parameters<F>>
>(
  fn: F,
  keyFrom: K = ((...args: Parameters<F>) => args[0]) as K
): WithCache<F, K> => {
  const cache = new Map<ReturnType<K>, ReturnType<F>>();

  const _memoWrapper: WithCache<F, K> = ((
    ...args: Parameters<F>
  ): ReturnType<F> => {
    const key = keyFrom(...args) as ReturnType<K>;

    if (cache.has(key)) {
      return cache.get(key)!;
    } else {
      const result = fn(...args) as ReturnType<F>;
      cache.set(key, result);
      return result;
    }
  }) as WithCache<F, K>;

  Reflect.defineProperty(_memoWrapper, 'cache', {
    get: () => cache,
    enumerable: false,
    configurable: false,
  });

  return _memoWrapper;
};
