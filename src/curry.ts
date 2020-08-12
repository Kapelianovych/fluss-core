export function curry<R>(fn: () => R): () => R;
export function curry<A, R>(fn: (a: A) => R, defaultArgs: [A]): () => R;
export function curry<A, R>(fn: (a: A) => R): (a: A) => R;
export function curry<A1, A2, R>(
  fn: (a1: A1, a2: A2) => R,
  defaultArgs: [A1, A2]
): () => R;
export function curry<A1, A2, R>(
  fn: (a1: A1, a2: A2) => R,
  defaultArgs: [A1]
): (a2: A2) => R;
export function curry<A1, A2, R>(
  fn: (a1: A1, a2: A2) => R
): (a1: A1) => (a2: A2) => R;
export function curry<A1, A2, A3, R>(
  fn: (a1: A1, a2: A2, a3: A3) => R,
  defaultArgs: [A1, A2, A3]
): () => R;
export function curry<A1, A2, A3, R>(
  fn: (a1: A1, a2: A2, a3: A3) => R,
  defaultArgs: [A1, A2]
): (a3: A3) => R;
export function curry<A1, A2, A3, R>(
  fn: (a1: A1, a2: A2, a3: A3) => R,
  defaultArgs: [A1]
): (a2: A2) => (a3: A3) => R;
export function curry<A1, A2, A3, R>(
  fn: (a1: A1, a2: A2, a3: A3) => R
): (a1: A1) => (a2: A2) => (a3: A3) => R;
export function curry<R>(
  fn: (...args: ReadonlyArray<any>) => R,
  defaultArgs: ReadonlyArray<any> = []
) {
  return (...args: ReadonlyArray<any>) => {
    return ((allArgs: ReadonlyArray<any>) => {
      // @ts-ignore
      return allArgs.length >= fn.length ? fn(...allArgs) : curry(fn, allArgs);
    })([...defaultArgs, ...args]);
  };
}
