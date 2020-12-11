import type { Last } from './utilities';

/** Performs right-to-left function composition. */
export function compose<
  T extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>
>(...fns: T): (...args: Parameters<Last<T>>) => ReturnType<T[0]> {
  return (...args) => {
    const firstFn = fns[fns.length - 1] ?? ((...x) => x);

    return fns
      .slice(0, fns.length - 1)
      .reduceRight((currentArgs, fn) => fn(currentArgs), firstFn(...args));
  };
}
