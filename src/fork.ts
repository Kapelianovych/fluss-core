/**
 * Allow join output of two functions that get
 * the same input and process it in a different way.
 */
export function fork<T extends ReadonlyArray<unknown>, R>(
  join: (...args: ReadonlyArray<any>) => R,
  ...fns: ReadonlyArray<(...args: T) => unknown>
): (...args: T) => R {
  return (...args: T) => join(...fns.map((fn) => fn(...args)));
}
