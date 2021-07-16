import { isPromise } from './is_promise';
import {
  First,
  HasPromise,
  ReturnTypesOf,
  IsParametersEqual,
} from './utilities';

const concat = <V, A extends ReadonlyArray<V>>(
  aggregator: A,
  result: V | Promise<V>
) =>
  isPromise<V>(result)
    ? result.then((value) => aggregator.concat(value))
    : aggregator.concat(result);

/**
 * Independently invokes functions with the same values
 * in order that they are passed. Can handle asynchronous
 * functions.
 */
export const sequentially =
  <V extends ReadonlyArray<(...values: ReadonlyArray<any>) => any>>(
    ...fns: V
  ) =>
  (
    ...values: IsParametersEqual<V> extends true ? Parameters<First<V>> : never
  ): HasPromise<V> extends true
    ? Promise<ReturnTypesOf<V>>
    : ReturnTypesOf<V> =>
    fns.reduce(
      (waiter, fn) =>
        isPromise<ReadonlyArray<V>>(waiter)
          ? waiter.then((results) => concat(results, fn(...values)))
          : concat(waiter, fn(...values)),
      [] as any
    );
