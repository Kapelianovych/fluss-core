/** Creates readonly type from set of elements. */
export function tuple<T extends ReadonlyArray<unknown>>(
  ...args: T
): readonly [...T] {
  return Object.freeze(args);
}
