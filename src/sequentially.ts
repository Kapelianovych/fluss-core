import { isPromise } from './is_promise';
import { First, Length, Tail } from './utilities';

type HasPromise<
  R extends ReadonlyArray<unknown>,
  A extends boolean = false
> = A extends true
  ? A
  : Length<R> extends 0
  ? A
  : HasPromise<Tail<R>, First<R> extends Promise<unknown> ? true : false>;

type ExtractReturnTypes<
  F extends ReadonlyArray<(...args: ReadonlyArray<unknown>) => unknown>,
  R extends ReadonlyArray<unknown> = []
> = Length<F> extends 0
  ? R
  : ExtractReturnTypes<Tail<F>, [...R, ReturnType<First<F>>]>;

type IsParametersEqual<
  F extends ReadonlyArray<(...values: ReadonlyArray<any>) => unknown>,
  R = []
> = Length<F> extends 0
  ? R extends false
    ? false
    : true
  : IsParametersEqual<
      Tail<F>,
      R extends []
        ? Parameters<First<F>>
        : R extends Parameters<First<F>>
        ? R
        : false
    >;

/**
 * Independently invokes functions with the same values
 * in order that they are passed. Can handle asynchronous
 * functions.
 */
export const sequentially = <
  V extends ReadonlyArray<(...values: ReadonlyArray<any>) => unknown>
>(
  ...fns: V
) => {
  return (
    ...values: IsParametersEqual<V> extends true
      ? Parameters<First<V>>
      : ReadonlyArray<unknown>
  ): HasPromise<ExtractReturnTypes<V>> extends true ? Promise<void> : void =>
    fns.reduce(
      (result, fn) =>
        isPromise(result) ? result.then(() => fn(...values)) : fn(...values),
      undefined as any
    );
};
