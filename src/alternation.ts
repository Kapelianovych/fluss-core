import { isNothing } from "./is_nothing";

export function alternation<R>(fn: () => R, fn1: () => R): () => R;
export function alternation<T, R>(
  fn: (a: T) => R,
  fn1: (a: T) => R
): (a: T) => R;
export function alternation<T, T1, R>(
  fn: (a: T, a1: T1) => R,
  fn1: (a: T, a1: T1) => R
): (a: T, a1: T1) => R;
export function alternation<T, T1, T2, R>(
  fn: (a: T, a1: T1, a2: T2) => R,
  fn1: (a: T, a1: T1, a2: T2) => R
): (a: T, a1: T1, a2: T2) => R;
export function alternation<R>(
  fn: () => R,
  fn1: () => R,
  fn2: () => R
): () => R;
export function alternation<T, R>(
  fn: (a: T) => R,
  fn1: (a: T) => R,
  fn2: (a: T) => R
): (a: T) => R;
export function alternation<T, T1, R>(
  fn: (a: T, a1: T1) => R,
  fn1: (a: T, a1: T1) => R,
  fn2: (a: T, a1: T1) => R
): (a: T, a1: T1) => R;
export function alternation<T, T1, T2, R>(
  fn: (a: T, a1: T1, a2: T2) => R,
  fn1: (a: T, a1: T1, a2: T2) => R,
  fn2: (a: T, a1: T1, a2: T2) => R
): (a: T, a1: T1, a2: T2) => R;
export function alternation<R>(
  ...fns: ReadonlyArray<(...args: ReadonlyArray<any>) => R>
): (...args: ReadonlyArray<any>) => R {
  return (...args: ReadonlyArray<any>) =>
    (
      fns.find((fn) => {
        const result = fn(...args);
        return (
          !Object.is(result, NaN) && !isNothing(result)
        );
      }) || fns[fns.length - 1]
    )(...args);
}
