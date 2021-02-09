/** Creates readonly array from set of ArrayLike, Iterable objects or values. */
export const array = <T>(
  ...values: ReadonlyArray<T | ArrayLike<T> | Iterable<T>>
): ReadonlyArray<T> => {
  // Here must be freezing array operation,
  // but due to [this Chromium bug](https://bugs.chromium.org/p/chromium/issues/detail?id=980227)
  // it is very slow operation and this action is not performed.
  return values
    .map((value) =>
      // Right value of "in" operator must be an object.
      // [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)
      typeof value === 'object' &&
      value !== null &&
      // Check if value is ArrayLike or Iterable
      ('length' in value || Symbol.iterator in value)
        ? Array.from(value as ArrayLike<T> | Iterable<T>)
        : Array.of(value as T)
    )
    .reduce((accumulator, current) => accumulator.concat(current), []);
};
