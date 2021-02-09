/** Creates readonly type from set of elements. */
export const tuple = <T extends ReadonlyArray<unknown>>(
  ...args: T
): readonly [...T] => {
  // Here must be freezing array operation,
  // but due to [this Chromium bug](https://bugs.chromium.org/p/chromium/issues/detail?id=980227)
  // it is very slow operation and this action is not performed.
  return args;
};
