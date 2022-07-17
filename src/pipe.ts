import { isPromise } from './is_promise.js';
import type { Tuple, Cast, Math } from './utilities.js';

type Composable<
  Fns extends readonly ((...args: readonly any[]) => unknown)[],
  Copy extends readonly ((...args: readonly any[]) => unknown)[] = Cast<
    Tuple.Shift<Fns>,
    readonly ((...args: readonly any[]) => unknown)[]
  >,
  Index extends number = 0,
> = Tuple.Length<Copy> extends 0
  ? Fns
  : Parameters<Copy[0]> extends [Awaited<ReturnType<Fns[Index]>>]
  ? Composable<
      Fns,
      Cast<
        Tuple.Shift<Copy>,
        readonly ((...args: readonly any[]) => unknown)[]
      >,
      Cast<Math.Plus<Index, 1>, number>
    >
  : Tuple.Slice<Fns, Cast<Math.Plus<Index, 1>, number>>;

type HasAsync<F extends readonly ((...args: readonly any[]) => unknown)[]> =
  F extends []
    ? false
    : ReturnType<Tuple.First<F>> extends Promise<unknown>
    ? true
    : HasAsync<
        Cast<Tuple.Shift<F>, readonly ((...args: readonly any[]) => unknown)[]>
      >;

/**
 * Performs left-to-right function composition.
 * Can handle asynchronous functions.
 */
export const pipe = <
  T extends readonly ((...args: readonly any[]) => unknown)[],
>(
  ...fns: Composable<T>
): ((
  ...args: Parameters<Tuple.First<T>>
) => HasAsync<T> extends true
  ? Promise<Awaited<ReturnType<Tuple.Last<T>>>>
  : ReturnType<Tuple.Last<T>>) =>
  // @ts-ignore
  fns.reduce((piped, fn) => (...params) => {
    const result = piped(...params);
    return isPromise(result) ? result.then(fn) : fn(result);
  });
