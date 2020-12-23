import type { Last } from './utilities';

/** Performs left-to-right function composition. */
export function pipe<
  T extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>
>(...fns: T): (...args: Parameters<T[0]>) => ReturnType<Last<T>> {
  return (...args) => {
    const firstFn = fns[0] ?? ((...x) => x);

    return fns
      .slice(1)
      .reduce((currentArgs, fn) => fn(currentArgs), firstFn(...args));
  };
}
