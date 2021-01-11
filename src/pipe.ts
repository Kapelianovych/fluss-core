import type { Last, Length, Tail } from './utilities';

type PipeCheck<
  T extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>,
  R extends ReadonlyArray<(...args: ReadonlyArray<any>) => any> = []
> = Length<T> extends 0
  ? R
  : PipeCheck<
      Tail<T>,
      // Function can return only one type, so we do not
      // need to check of all parameters of next function,
      // but only first.
      ReturnType<Last<R>> extends Parameters<T[0]>[0] ? [...R, T[0]] : never
    >;

/** Performs left-to-right function composition. */
export function pipe<
  T extends readonly [
    (...args: ReadonlyArray<any>) => any,
    ...ReadonlyArray<(arg: any) => any>
  ]
>(
  ...fns: T
): PipeCheck<T> extends never
  ? never
  : (...args: Parameters<T[0]>) => ReturnType<Last<T>> {
  // @ts-ignore
  return (...args) => {
    const firstFn = fns[0] ?? ((...x) => x);

    return fns
      .slice(1)
      .reduce((currentArgs, fn) => fn(currentArgs), firstFn(...args));
  };
}
