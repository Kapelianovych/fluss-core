import { array } from './array';
import { isPromise } from './is_promise';
import { NFn, NArray, If } from './utilities';

const concat = <V, A extends ReadonlyArray<V>>(
  aggregator: A,
  result: V | Promise<V>,
) =>
  isPromise<V>(result)
    ? result.then((value) => aggregator.concat(value))
    : aggregator.concat(result);

type SequentiallyParameters<V extends ReadonlyArray<any>> = NArray.Flatten<
  NArray.TrimLastEmpty<NFn.ParametersOf<V>>
>;

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
    ...values: If<
      NArray.IsSameInnerType<SequentiallyParameters<V>>,
      SequentiallyParameters<V> | [NArray.First<SequentiallyParameters<V>>],
      SequentiallyParameters<V>
    >
  ): NFn.IsAsyncIn<V> extends true
    ? Promise<NFn.ReturnTypesOf<V>>
    : NFn.ReturnTypesOf<V> => {
    const parameters =
      (values as any[]).length === 0
        ? fns.map(() => [])
        : (values as any[]).length === 1
        ? fns.map(() => array((values as any[])[0]))
        : (values as any[]).map((value) => array(value));

    return fns.reduce(
      (waiter, fn, index) =>
        isPromise<ReadonlyArray<V>>(waiter)
          ? waiter.then((results) => concat(results, fn(...parameters[index])))
          : concat(waiter, fn(...parameters[index])),
      [] as any,
    );
  };
