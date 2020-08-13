import { reduce } from './reduce';
import { arrayFrom } from './array_from';

export function concat<T>(
  ...arraysOrValues: ReadonlyArray<ArrayLike<T> | Iterable<T>>
): ReadonlyArray<T> {
  return Object.freeze(
    reduce(
      arrayFrom(arraysOrValues),
      (resultArray: Array<T>, innerArrayOrValue) =>
        resultArray.concat(arrayFrom(innerArrayOrValue)),
      []
    )
  );
}
