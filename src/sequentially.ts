import { isPromise } from './is_promise';
import {
  Tail,
  Head,
  Last,
  First,
  Length,
  HasPromise,
  ParametersOf,
  ReturnTypesOf,
} from './utilities';

const concat = <V, A extends ReadonlyArray<V>>(
  aggregator: A,
  result: V | Promise<V>
) =>
  isPromise<V>(result)
    ? result.then((value) => aggregator.concat(value))
    : aggregator.concat(result);

const parameters = <P>(values: P | ReadonlyArray<P>): ReadonlyArray<P> =>
  Array.isArray(values) ? values : [values];

const defined = <P>(value: P | undefined) => (value === undefined ? [] : value);

type TrimLastEmpty<V extends ReadonlyArray<any>> = Length<Last<V>> extends 0
  ? TrimLastEmpty<Head<V>>
  : V;

type SingleOrMany<
  V extends ReadonlyArray<any>,
  R extends ReadonlyArray<any> = []
> = Length<V> extends 0
  ? R
  : SingleOrMany<
      Tail<V>,
      First<V> extends [infer U] ? [...R, U] : [...R, First<V>]
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
    ...values: SingleOrMany<TrimLastEmpty<ParametersOf<V>>>
  ): HasPromise<V> extends true
    ? Promise<ReturnTypesOf<V>>
    : ReturnTypesOf<V> =>
    fns.reduce((waiter, fn, index) => {
      const fnParams = parameters(
        // @ts-ignore
        defined(values[index])
      );

      return isPromise<ReadonlyArray<V>>(waiter)
        ? waiter.then((results) => concat(results, fn(...fnParams)))
        : concat(waiter, fn(...fnParams));
    }, [] as any);
