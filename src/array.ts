import { isObject } from './is_object';

/** Creates readonly array from set of ArrayLike, Iterable objects or values. */
export const array = <T>(
  ...values: ReadonlyArray<T | ArrayLike<T> | Iterable<T>>
): ReadonlyArray<T> =>
  values.flatMap((value) =>
    isObject(value) && ('length' in value || Symbol.iterator in value)
      ? Array.from(value as ArrayLike<T> | Iterable<T>)
      : Array.of(value as T),
  );
