export function fork<T, R, R1, R2>(
  join: (f: R1, s: R2) => R,
  fn1: (a: T) => R1,
  fn2: (a: T) => R2
): (a: T) => R;
export function fork<T, T1, R, R1, R2>(
  join: (f: R1, s: R2) => R,
  fn1: (a: T, a1: T1) => R1,
  fn2: (a: T, a1: T1) => R2
): (a: T, a1: T1) => R;
export function fork<T, T1, T2, R, R1, R2>(
  join: (f: R1, s: R2) => R,
  fn1: (a: T, a1: T1, a2: T2) => R1,
  fn2: (a: T, a1: T1, a2: T2) => R2
): (a: T, a1: T1, a2: T2) => R;
export function fork<R>(
  join: (...args: ReadonlyArray<any>) => R,
  ...fns: ReadonlyArray<(...args: ReadonlyArray<any>) => any>
): (...args: ReadonlyArray<any>) => R {
  return (...args: ReadonlyArray<any>) => join(...fns.map((fn) => fn(...args)));
}
