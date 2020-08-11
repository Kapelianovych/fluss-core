export function arrayFrom<T>(
  ...iterables: ReadonlyArray<ArrayLike<T> | Iterable<T>>
): ReadonlyArray<T> {
  return Object.freeze(
    iterables
      .map((iterable) => Array.from(iterable))
      .reduce((resultArray, innerArray) => resultArray.concat(innerArray), [])
  );
}
