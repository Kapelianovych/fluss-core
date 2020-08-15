import { Maybe, nothing, maybeOf } from './maybe';

export function alternation<R>(
  fn: () => R | null | undefined,
  fn1: () => R | null | undefined
): () => Maybe<R>;
export function alternation<T, R>(
  fn: (a: T) => R | null | undefined,
  fn1: (a: T) => R | null | undefined
): (a: T) => Maybe<R>;
export function alternation<T, T1, R>(
  fn: (a: T, a1: T1) => R | null | undefined,
  fn1: (a: T, a1: T1) => R | null | undefined
): (a: T, a1: T1) => Maybe<R>;
export function alternation<T, T1, T2, R>(
  fn: (a: T, a1: T1, a2: T2) => R | null | undefined,
  fn1: (a: T, a1: T1, a2: T2) => R | null | undefined
): (a: T, a1: T1, a2: T2) => Maybe<R>;
export function alternation<R>(
  fn: () => R | null | undefined,
  fn1: () => R | null | undefined,
  fn2: () => R | null | undefined
): () => Maybe<R>;
export function alternation<T, R>(
  fn: (a: T) => R | null | undefined,
  fn1: (a: T) => R | null | undefined,
  fn2: (a: T) => R | null | undefined
): (a: T) => Maybe<R>;
export function alternation<T, T1, R>(
  fn: (a: T, a1: T1) => R | null | undefined,
  fn1: (a: T, a1: T1) => R | null | undefined,
  fn2: (a: T, a1: T1) => R | null | undefined
): (a: T, a1: T1) => Maybe<R>;
export function alternation<T, T1, T2, R>(
  fn: (a: T, a1: T1, a2: T2) => R | null | undefined,
  fn1: (a: T, a1: T1, a2: T2) => R | null | undefined,
  fn2: (a: T, a1: T1, a2: T2) => R | null | undefined
): (a: T, a1: T1, a2: T2) => Maybe<R>;
export function alternation<R>(
  ...fns: ReadonlyArray<(...args: ReadonlyArray<any>) => R | null | undefined>
): (...args: ReadonlyArray<any>) => Maybe<R> {
  return (...args: ReadonlyArray<any>) => {
    let result = nothing<R>();

    for (const fn of fns) {
      if (result.isJust() && !Object.is(result.extract(), NaN)) {
        return result;
      }

      result = maybeOf(fn(...args));
    }

    return result;
  };
}
