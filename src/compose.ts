import type { Last } from './utilities';

/** Performs right-to-left function composition. */
export function compose<T extends Array<(...args: ReadonlyArray<any>) => any>>(
  ...fns: T
): (...args: Parameters<Last<T>>) => ReturnType<T[0]> {
  return (...args) => {
    const firstFn = fns.pop() ?? ((...x) => x);

    return fns.reduceRight(
      (currentArgs, fn) => fn(currentArgs),
      firstFn(...args)
    );
  };
}
