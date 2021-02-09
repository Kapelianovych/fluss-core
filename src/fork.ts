/**
 * Allow join output of functions that get
 * the same input and process it in a different way.
 */
export const fork = <T extends ReadonlyArray<unknown>, R>(
  join: (...args: ReadonlyArray<any>) => R,
  ...fns: ReadonlyArray<(...args: T) => unknown>
): ((...args: T) => R) => {
  return (...args: T) => join(...fns.map((fn) => fn(...args)));
};
