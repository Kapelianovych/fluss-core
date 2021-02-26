import { isObject } from './is_object';
import { isNothing } from './is_just_nothing';
import { isFunction } from './is_function';
import { some, Option, none } from './option';
import type { Just } from './utilities';
import type {
  Foldable,
  Typeable,
  Sizeable,
  Serializable,
  IterableIteratorFunction,
} from './types';

export const LIST_OBJECT_TYPE = 'List';

/** Monad that represents lazy Array. */
export interface List<T>
  extends Typeable,
    Sizeable,
    Iterable<T>,
    Foldable<T>,
    Serializable<ReadonlyArray<T>> {
  /**
   * Check if all values of `List` pass _predicate_ function.
   * If list is empty, then method returns `true`.
   */
  all(predicate: (value: T) => boolean): boolean;
  /**
   * Check if at least one value of `List` passes _predicate_ function.
   * If list is empty, then method returns `false`.
   */
  any(predicate: (value: T) => boolean): boolean;
  has(value: T): boolean;
  map<R>(fn: (value: T) => R): List<R>;
  sort(fn: (first: T, second: T) => number): List<T>;
  take(count: number): List<T>;
  skip(count: number): List<T>;
  find(predicate: (item: T) => boolean): Option<T>;
  chain<R>(fn: (value: T) => List<R>): List<R>;
  apply<R>(other: List<(value: T) => R>): List<R>;
  filter(predicate: (value: T) => boolean): List<T>;
  append(...values: ReadonlyArray<T>): List<T>;
  concat(other: List<T>): List<T>;
  prepend(...values: ReadonlyArray<T>): List<T>;
  asArray(): ReadonlyArray<T>;
  uniqueBy<U>(fn: (item: T) => U): List<T>;
  /** Get rid of `Nothing` values. */
  compress(): List<Just<T>>;
  forEach(fn: (value: T) => void): void;
}

/** Create `List` from function that returns itarable iterator. */
export const iterate = <T>(over: IterableIteratorFunction<T>): List<T> => ({
  [Symbol.iterator]: over,
  type: () => LIST_OBJECT_TYPE,
  toJSON: () => ({
    type: LIST_OBJECT_TYPE,
    value: [...over()],
  }),
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
  reduce: (fn, accumulator) => {
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
  append: (...values) =>
    iterate(function* () {
      for (const item of [over(), values]) {
        yield* item;
      }
    }),
  prepend: (...values) =>
    iterate(function* () {
      for (const item of [values, over()]) {
        yield* item;
      }
    }),
  uniqueBy: (fn) =>
    iterate(function* () {
      const unique = new Set<ReturnType<typeof fn>>();

      for (const item of over()) {
        const key = fn(item);

        if (!unique.has(key)) {
          unique.add(key);
          yield item;
        }
      }
    }),
  sort: (fn) =>
    iterate(function* () {
      for (const item of [...over()].sort(fn)) {
        yield item;
      }
    }),
  compress: () =>
    iterate(function* () {
      for (const item of over()) {
        if (!isNothing(item)) {
          yield item as Just<T>;
        }
      }
    }),
  take: (count) =>
    iterate(function* () {
      for (const item of over()) {
        if (0 <= --count) {
          yield item;
        } else {
          // Ends iteration even if in parent list are many
          // values yet. Explicit returning increase
          // method's performance.
          return;
        }
      }
    }),
  skip: (count) =>
    iterate(function* () {
      for (const item of over()) {
        if (0 > --count) {
          yield item;
        }
      }
    }),
  forEach: (fn) => {
    for (const item of over()) {
      fn(item);
    }
  },
  has: (value) => {
    for (const item of over()) {
      if (Object.is(value, item)) {
        return true;
      }
    }

    return false;
  },
  find: (predicate) => {
    for (const item of over()) {
      if (predicate(item)) {
        return some(item);
      }
    }

    return none;
  },
  size: () => [...over()].length,
  isEmpty: () => over().next().done === true,
  asArray: () => [...over()],
});

/** Create `List` from values, array-like objects or iterables. */
export const list = <T>(
  ...values: ReadonlyArray<T | ArrayLike<T> | Iterable<T>>
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
          yield (value as unknown) as T;
        }
      } else {
        yield value;
      }
    }
  });

/** Check if _value_ is instance of `List`. */
export const isList = <T>(value: unknown): value is List<T> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  (value as Typeable).type() === LIST_OBJECT_TYPE;
