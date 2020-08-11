export function arrayOf<V>(...args: ReadonlyArray<V>): ReadonlyArray<V> {
  return Object.freeze(args);
}
