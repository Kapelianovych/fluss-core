/**
 * Lets invoke independent functions with the same values
 * in order that they are declared.
 */
export function sequence<V extends ReadonlyArray<unknown>>(
  ...fns: ReadonlyArray<(...values: V) => unknown>
): (...values: V) => void {
  return (...values: V) => fns.forEach((fn) => fn(...values));
}
