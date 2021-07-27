import { array } from './array';
import { isPromise } from './is_promise';
import { NFn, NArray } from './utilities';

const concat = <V, A extends ReadonlyArray<V>>(
  aggregator: A,
  result: V | Promise<V>
) =>
  isPromise<V>(result)
    ? result.then((value) => aggregator.concat(value))
    : aggregator.concat(result);

/**
 * Independently invokes functions with their parameters
 * in order that functions are passed. Can handle asynchronous
 * functions.
 */
export const sequentially =
  <V extends ReadonlyArray<(...values: ReadonlyArray<any>) => any>>(
    ...fns: V
  ) =>
  (
    ...values: NArray.SingleOrMany<NArray.TrimLastEmpty<NFn.ParametersOf<V>>>
  ): NFn.IsAsync<V> extends true
    ? Promise<NFn.ReturnTypesOf<V>>
    : NFn.ReturnTypesOf<V> =>
    fns.reduce((waiter, fn, index) => {
      const parameters = array((values as any[])[index]).filter(
        (value) => value !== undefined
      );

      return isPromise<ReadonlyArray<V>>(waiter)
        ? waiter.then((results) => concat(results, fn(...parameters)))
        : concat(waiter, fn(...parameters));
    }, [] as any);
