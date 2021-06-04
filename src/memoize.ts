export interface MemoizeFunction {
  <F extends (...args: ReadonlyArray<any>) => any>(
    fn: F,
    keyFrom?: (...args: Parameters<F>) => unknown
  ): F;
}

/**
 * Wraps function and cache all execution results.
 * Allows to customize key for cache. By default, it
 * is first function's argument.
 */
export const memoize = ((fn, keyFrom = (...args) => args[0]) => {
  const cache = new Map();

  return (...args: Parameters<typeof fn>) => {
    const key = keyFrom(...args);

    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }
  };
}) as MemoizeFunction;
