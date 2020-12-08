/** It performs right-to-left function composition. */
export function compose(): (
  ...args: ReadonlyArray<unknown>
) => ReadonlyArray<unknown>;
export function compose<R>(fn: () => R): () => R;
export function compose<A, R>(fn: (a: A) => R): (a: A) => R;
export function compose<A1, A2, R>(
  fn: (a1: A1, a2: A2) => R
): (a1: A1, a2: A2) => R;
export function compose<A1, A2, A3, R>(
  fn: (a1: A1, a2: A2, a3: A3) => R
): (a1: A1, a2: A2, a3: A3) => R;
export function compose<R1, R2>(fn2: (a1: R1) => R2, fn1: () => R1): () => R2;
export function compose<A, R1, R2>(
  fn2: (a1: R1) => R2,
  fn1: (a: A) => R1
): (a: A) => R2;
export function compose<A1, A2, R1, R2>(
  fn2: (a1: R1) => R2,
  fn1: (a1: A1, a2: A2) => R1
): (a1: A1, a2: A2) => R2;
export function compose<A1, A2, A3, R1, R2>(
  fn2: (a1: R1) => R2,
  fn1: (a1: A1, a2: A2, a3: A3) => R1
): (a1: A1, a2: A2, a3: A3) => R2;
export function compose<R1, R2, R3>(
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: () => R1
): () => R3;
export function compose<A, R1, R2, R3>(
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a: A) => R1
): (a: A) => R3;
export function compose<A1, A2, R1, R2, R3>(
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a1: A1, a2: A2) => R1
): (a1: A1, a2: A2) => R3;
export function compose<A1, A2, A3, R1, R2, R3>(
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a1: A1, a2: A2, a3: A3) => R1
): (a1: A1, a2: A2, a3: A3) => R3;
export function compose<R1, R2, R3, R4>(
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: () => R1
): () => R4;
export function compose<A, R1, R2, R3, R4>(
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a: A) => R1
): (a: A) => R4;
export function compose<A1, A2, R1, R2, R3, R4>(
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a1: A1, a2: A2) => R1
): (a1: A1, a2: A2) => R4;
export function compose<A1, A2, A3, R1, R2, R3, R4>(
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a1: A1, a2: A2, a3: A3) => R1
): (a1: A1, a2: A2, a3: A3) => R4;
export function compose<R1, R2, R3, R4, R5>(
  fn5: (a1: R4) => R5,
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: () => R1
): () => R5;
export function compose<A, R1, R2, R3, R4, R5>(
  fn5: (a1: R4) => R5,
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a: A) => R1
): (a: A) => R5;
export function compose<A1, A2, R1, R2, R3, R4, R5>(
  fn5: (a1: R4) => R5,
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a1: A1, a2: A2) => R1
): (a1: A1, a2: A2) => R5;
export function compose<A1, A2, A3, R1, R2, R3, R4, R5>(
  fn5: (a1: R4) => R5,
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a1: A1, a2: A2, a3: A3) => R1
): (a1: A1, a2: A2, a3: A3) => R5;
export function compose<R1, R2, R3, R4, R5, R6>(
  fn6: (a1: R5) => R6,
  fn5: (a1: R4) => R5,
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: () => R1
): () => R6;
export function compose<A, R1, R2, R3, R4, R5, R6>(
  fn6: (a1: R5) => R6,
  fn5: (a1: R4) => R5,
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a: A) => R1
): (a: A) => R6;
export function compose<A1, A2, R1, R2, R3, R4, R5, R6>(
  fn6: (a1: R5) => R6,
  fn5: (a1: R4) => R5,
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a1: A1, a2: A2) => R1
): (a1: A1, a2: A2) => R6;
export function compose<A1, A2, A3, R1, R2, R3, R4, R5, R6>(
  fn6: (a1: R5) => R6,
  fn5: (a1: R4) => R5,
  fn4: (a1: R3) => R4,
  fn3: (a1: R2) => R3,
  fn2: (a1: R1) => R2,
  fn1: (a1: A1, a2: A2, a3: A3) => R1
): (a1: A1, a2: A2, a3: A3) => R6;
export function compose<R>(
  ...fns: Array<(...args: ReadonlyArray<unknown>) => unknown>
): (...args: ReadonlyArray<unknown>) => R {
  return (...args: ReadonlyArray<unknown>): R => {
    const firstFn = fns.pop() ?? ((...x) => x);

    return fns.reduceRight(
      (currentArgs, fn) => fn(currentArgs),
      firstFn(...args)
    ) as R;
  };
}
