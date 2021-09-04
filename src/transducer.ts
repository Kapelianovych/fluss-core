import { pipe } from './pipe';
import { list } from './list';
import { NArray } from './utilities';
import { isNothing } from './is_just_nothing';
import { Foldable, Reducer, Transducer } from './types';

type ChainTransducers<
  O extends ReadonlyArray<Transducer<any, any, any>>,
  T extends ReadonlyArray<Transducer<any, any, any>> = [],
> = NArray.Length<O> extends number
  ? O
  : NArray.Length<O> extends 0
  ? T
  : ChainTransducers<
      NArray.Tail<O>,
      [
        ...T,
        ReturnType<NArray.Last<T>> extends NArray.First<
          Parameters<NArray.First<O>>
        >
          ? NArray.First<O>
          : never,
      ]
    >;

/** Creates a reducer. */
export const reducer =
  <T>(initial: T) =>
  <K>(fn: (accumulator: T, current: K) => T): Reducer<T, K> =>
  (accumulator: T = initial, current?: K): T =>
    isNothing(current) ? accumulator : fn(accumulator, current);

/** Creates transduce operation over a `Foldable` instance. */
export const transduce =
  <T extends Foldable<any>>(instance: T) =>
  <I, K>(aggregator: Reducer<I, K>) =>
  <R extends ReadonlyArray<Transducer<I, any, any>>>(
    ...transducers: ChainTransducers<R>
  ): I =>
    // @ts-ignore
    instance.reduce(pipe(...transducers)(aggregator), aggregator());

/** Creates a _transformer_ transducer. */
export const map =
  <I, R, K>(fn: (value: R) => K): Transducer<I, K, R> =>
  (inner: Reducer<I, K>) =>
    reducer(inner())((accumulator, current) => inner(accumulator, fn(current)));

/** Creates a _filter_ transducer. */
export const filter =
  <I, R>(predicate: (value: R) => boolean): Transducer<I, R, R> =>
  (inner: Reducer<I, R>) =>
    reducer(inner())((accumulator, current) =>
      predicate(current) ? inner(accumulator, current) : accumulator,
    );

/** Collect result of transducing into an array. */
export const toArray = <T>() =>
  reducer<ReadonlyArray<T>>([])((accumulator, current: T) =>
    accumulator.concat([current]),
  );

/** Collect result of transducing into an `List`. */
export const toList = <T>() =>
  reducer(list<T>())((accumulator, current: T) =>
    accumulator.concat(list(current)),
  );
