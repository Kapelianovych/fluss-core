import { isObject } from './is_object.js';
import { isFunction } from './is_function.js';
import { Some, Option, None } from './option.js';
import type { Reducer } from './utilities.js';

export const LIST_TYPE = '__$List';

interface Part<T> {
  (count: number): List<T>;
  (predicate: (value: T) => boolean): List<T>;
}

/** Monad that represents the lazy Array. */
export type List<T> = Iterable<T> & {
  readonly [LIST_TYPE]: null;

  /**
   * Check if all values of `List` pass _predicate_ function.
   * If list is empty, then method returns `true`.
   */
  readonly all: (predicate: (value: T) => boolean) => boolean;
  /**
   * Check if at least one value of `List` passes _predicate_ function.
   * If list is empty, then method returns `false`.
   */
  readonly any: (predicate: (value: T) => boolean) => boolean;
  readonly map: <R>(fn: (value: T) => R) => List<R>;
  readonly size: () => number;
  readonly sort: (fn: (first: T, second: T) => number) => List<T>;
  readonly take: Part<T>;
  readonly skip: Part<T>;
  readonly find: (predicate: (item: T) => boolean) => Option<T>;
  readonly fold: <K>(reducer: Reducer<K, T>) => K;
  readonly chain: <R>(fn: (value: T) => List<R>) => List<R>;
  readonly apply: <R>(other: List<(value: T) => R>) => List<R>;
  readonly filter: (predicate: (value: T) => boolean) => List<T>;
  readonly concat: (other: List<T>) => List<T>;
  readonly toJSON: () => {
    readonly type: string;
    readonly value: readonly T[];
  };
  readonly isEmpty: () => boolean;
  readonly prepend: (other: List<T>) => List<T>;
  readonly collect: () => readonly T[];
  readonly forEach: (fn: (value: T) => void) => void;
};

/** Creates the `List` from a function that returns an iterable iterator. */
export const iterate = <T>(over: () => Generator<T>): List<T> => ({
  [LIST_TYPE]: null,
  [Symbol.iterator]: over,

  map: (fn) =>
    iterate(function* () {
      for (const item of over()) {
        yield fn(item);
      }
    }),
  chain: (fn) =>
    iterate(function* () {
      for (const item of over()) {
        yield* fn(item);
      }
    }),
  apply: (other) =>
    iterate(function* () {
      for (const item of over()) {
        yield other[Symbol.iterator]().next().value(item);
      }
    }),
  filter: (predicate) =>
    iterate(function* () {
      for (const item of over()) {
        if (predicate(item)) {
          yield item;
        }
      }
    }),
  fold: (fn) => {
    let accumulator = fn();

    for (const item of over()) {
      accumulator = fn(accumulator, item);
    }

    return accumulator;
  },
  concat: (other) =>
    iterate(function* () {
      for (const item of [over(), other]) {
        yield* item;
      }
    }),
  all: (predicate) => {
    for (const item of over()) {
      if (!predicate(item)) {
        return false;
      }
    }

    return true;
  },
  any: (predicate) => {
    for (const item of over()) {
      if (predicate(item)) {
        return true;
      }
    }

    return false;
  },
  prepend: (other) =>
    iterate(function* () {
      for (const item of [other, over()]) {
        yield* item;
      }
    }),
  sort: (fn) =>
    iterate(function* () {
      for (const item of Array.from(over()).sort(fn)) {
        yield item;
      }
    }),
  take: (countOrPredicate) =>
    iterate(function* () {
      const predicate = isFunction(countOrPredicate)
        ? countOrPredicate
        : () => 0 <= --(countOrPredicate as number);

      for (const item of over()) {
        if (predicate(item)) {
          yield item;
        } else {
          // Ends iteration even if in parent list are many
          // values yet. Explicit returning increase
          // method's performance.
          return;
        }
      }
    }),
  skip: (countOrPredicate) =>
    iterate(function* () {
      const predicate = isFunction(countOrPredicate)
        ? countOrPredicate
        : () => 0 <= --(countOrPredicate as number);

      for (const item of over()) {
        if (!predicate(item)) {
          yield item;
        }
      }
    }),
  forEach: (fn) => {
    for (const item of over()) {
      fn(item);
    }
  },
  find: (predicate) => {
    for (const item of over()) {
      if (predicate(item)) {
        return Some(item);
      }
    }

    return None;
  },
  size: () => Array.from(over()).length,
  isEmpty: () => over().next().done === true,
  collect: () => Array.from(over()),
  toJSON: () => ({
    type: LIST_TYPE,
    value: Array.from(over()),
  }),
});

/** Creates a `List` from values, array-like objects or iterables. */
export const List = <T>(
  ...values: readonly (T | ArrayLike<T> | Iterable<T>)[]
): List<T> =>
  iterate(function* () {
    for (const value of values) {
      if (isObject(value)) {
        if (Symbol.iterator in value) {
          yield* value as Iterable<T>;
        } else if ('length' in value) {
          yield* Array.from(value);
        } else {
          // T type may be itself an object.
          yield value as unknown as T;
        }
      } else {
        yield value;
      }
    }
  });

/** Checks if _value_ is instance of `List`. */
export const isList = <T>(value: unknown): value is List<T> =>
  isObject(value) && LIST_TYPE in value;
