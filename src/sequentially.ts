import { isPromise } from './is_promise';
import { Tail, First, Length, HasPromise, ReturnTypesOf } from './utilities';

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
) => (
  ...values: IsParametersEqual<V> extends true
    ? Parameters<First<V>>
    : ReadonlyArray<unknown>
): HasPromise<ReturnTypesOf<V>> extends true ? Promise<void> : void =>
  fns.reduce(
    (result, fn) =>
      isPromise(result) ? result.then(() => fn(...values)) : fn(...values),
    undefined as any
  );
