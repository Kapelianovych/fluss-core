import { isPromise } from './is_promise';
import {
  First,
  HasPromise,
  ReturnTypesOf,
  IsParametersEqual,
} from './utilities';

const concat = <V, A extends ReadonlyArray<V>>(
  aggregator: A | Promise<A>,
  result: V
) =>
  isPromise<A>(aggregator)
    ? aggregator.then((a) => a.concat(result))
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
    fns.reduce((aggregator, fn) => {
      const result = fn(...values);

      return isPromise(result)
        ? result.then((value) => concat(aggregator, value))
        : concat(aggregator, result);
    }, [] as any);
