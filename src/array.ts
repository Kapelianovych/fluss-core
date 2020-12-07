/** Creates readonly array from set of ArrayLike, Iterable objects or values. */
export function array<T>(
  ...values: ReadonlyArray<T | ArrayLike<T> | Iterable<T>>
): ReadonlyArray<T> {
  return Object.freeze(
    values
      .map((value) =>
        // Right value of "in" operator must be an object.
        // [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)
        typeof value === 'object' &&
        // Check if value is ArrayLike or Iterable
        ('length' in value || Symbol.iterator in value)
          ? Array.from(value as ArrayLike<T> | Iterable<T>)
          : Array.of(value as T)
      )
      .reduce((resultArray, innerArray) => resultArray.concat(innerArray), [])
  );
}
