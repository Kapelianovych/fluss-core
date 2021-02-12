import type { Pop, Shift, Length, Position, Transform } from './utilities';
import type {
  Serializable,
  SerializabledObject,
  IterableIteratorFunction,
} from './types';

/** Immutable container for fixed sequence of values. */
class Tuple<T extends ReadonlyArray<unknown>>
  implements Iterable<T[number]>, Serializable<T> {
  readonly [Symbol.iterator]: IterableIteratorFunction<T[number]>;

  // TODO: review this when ECMAScript's private class fields will be
  // widely spread in browsers.
  private constructor(fn: IterableIteratorFunction<T[number]>) {
    this[Symbol.iterator] = fn;
  }

  /** Creates `Tuple` based on given values. */
  static tuple<T extends ReadonlyArray<unknown>>(...values: T): Tuple<T> {
    return new Tuple<T>(values[Symbol.iterator].bind(values));
  }

  item<P extends number>(position: P): T[P] {
    // Because of Tuple is a fixed numbered sequence of values,
    // we do not need to wrap returned item into Maybe monad.
    // There is not practical needs for accessing outside of
    // range in tuples, so this method will return undefined.

    let count = 0;
    for (const item of this) {
      if (count === position) {
        return item;
      }
      count++;
    }
  }

  transform<P extends number, R>(
    position: P,
    fn: (value: T[P]) => R
  ): Tuple<Transform<P, R, T>> {
    const self = this;
    return (new Tuple(function* () {
      let count = 0;

      for (const item of self) {
        const isRightPosition = count === position;
        count++;
        yield isRightPosition ? fn(item) : item;
      }
    }) as unknown) as Tuple<Transform<P, R, T>>;
  }

  position<V extends T[number]>(value: V): Position<V, T> {
    let count = 0;
    for (const item of this) {
      if (Object.is(item, value)) {
        return count as Position<V, T>;
      }
      count++;
    }

    return -1 as Position<V, T>;
  }

  append<V extends ReadonlyArray<unknown>>(...values: V): Tuple<[...T, ...V]> {
    const concatenated = [this, values] as [Tuple<T>, V];
    return new Tuple<[...T, ...V]>(function* () {
      for (const item of concatenated) {
        yield* item;
      }
    });
  }

  prepend<V extends ReadonlyArray<unknown>>(...values: V): Tuple<[...V, ...T]> {
    const concatenated = [values, this] as [V, Tuple<T>];
    return new Tuple<[...V, ...T]>(function* () {
      for (const item of concatenated) {
        yield* item;
      }
    });
  }

  // @ts-ignore - TS does not allow to assign 1 to C
  shift<C extends number = 1>(count: C = 1): Tuple<Shift<C, T>> {
    const self = this;
    return (new Tuple(function* () {
      for (const item of self) {
        if (0 >= count--) {
          yield item;
        }
      }
    }) as unknown) as Tuple<Shift<C, T>>;
  }

  // @ts-ignore - TS does not allow to assign 1 to C
  pop<C extends number = 1>(count: C = 1): Tuple<Pop<C, T>> {
    const self = this;
    let takeCount = Array.from(this).length - count;
    return (new Tuple(function* () {
      for (const item of self) {
        if (0 <= --takeCount) {
          yield item;
        } else {
          return;
        }
      }
    }) as unknown) as Tuple<Pop<C, T>>;
  }

  size(): Length<T> {
    return Array.from(this).length;
  }

  toJSON(): SerializabledObject<T> {
    return {
      type: 'Tuple',
      value: (Array.from<T[number]>(this) as unknown) as T,
    };
  }
}

export type { Tuple };
export const { tuple } = Tuple;

/** Check if value is instance of `Tuple`. */
export const isTuple = <T extends ReadonlyArray<unknown>>(
  value: unknown
): value is Tuple<T> => value instanceof Tuple;
