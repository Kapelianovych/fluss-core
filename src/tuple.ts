import { NArray } from './utilities';
import { isObject } from './is_object';
import { isFunction } from './is_function';
import { Typeable, Sizeable, Serializable } from './types';

export const TUPLE_OBJECT_TYPE = '$Tuple';

/** Immutable container for fixed sequence of values. */
export interface Tuple<T extends ReadonlyArray<any>>
  extends Iterable<T[number]>,
    Typeable,
    Sizeable,
    Serializable<T> {
  pop<C extends number = 1>(count?: C): Tuple<NArray.Pop<C, T>>;
  item<P extends number>(position: P): T[P];
  shift<C extends number = 1>(count?: C): Tuple<NArray.Shift<C, T>>;
  append<V extends ReadonlyArray<unknown>>(...values: V): Tuple<[...T, ...V]>;
  concat<V extends ReadonlyArray<unknown>>(
    other: Tuple<V>
  ): Tuple<[...T, ...V]>;
  prepend<V extends ReadonlyArray<unknown>>(...values: V): Tuple<[...V, ...T]>;
  position<V extends T[number]>(value: V): number;
  transform<P extends number, R>(
    position: P,
    fn: (value: T[P]) => R
  ): Tuple<NArray.Transform<P, R, T>>;
  asArray(): T;
}

/** Creates `Tuple` based on given values. */
export const tuple = <T extends ReadonlyArray<any>>(
  ...values: T
): Tuple<T> => ({
  type: () => TUPLE_OBJECT_TYPE,
  [Symbol.iterator]: function* () {
    for (const item of values) {
      yield item;
    }
  },
  toJSON: () => ({
    type: TUPLE_OBJECT_TYPE,
    value: values,
  }),
  size: () => values.length,
  item: (position) => values[position],
  transform: <P extends number, R>(position: P, fn: (value: T[P]) => R) =>
    tuple(
      ...(values.map((value, index) =>
        index === position ? fn(value) : value
      ) as NArray.Transform<P, R, T>)
    ),
  position: (value) => values.indexOf(value),
  append: <V extends ReadonlyArray<unknown>>(...items: V) =>
    tuple(...(values.concat(items) as [...T, ...V])),
  concat: <V extends ReadonlyArray<unknown>>(other: Tuple<V>) =>
    tuple<[...T, ...V]>(...(values.concat([...other]) as [...T, ...V])),
  prepend: <V extends ReadonlyArray<unknown>>(...items: V) =>
    tuple(...(items.concat(values) as [...V, ...T])),
  shift: <C extends number = 1>(count = 1) =>
    tuple<NArray.Shift<C, T>>(...(values.slice(count) as NArray.Shift<C, T>)),
  pop: <C extends number = 1>(count = 1) =>
    tuple<NArray.Pop<C, T>>(
      ...(values.slice(0, values.length - count) as NArray.Pop<C, T>)
    ),
  isEmpty: () => values.length === 0,
  asArray: () => values,
});

/** Check if value is instance of `Tuple`. */
export const isTuple = <T extends ReadonlyArray<any>>(
  value: unknown
): value is Tuple<T> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  (value as Typeable).type() === TUPLE_OBJECT_TYPE;
