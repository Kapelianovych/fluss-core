export function sequence<V>(
  ...fns: ReadonlyArray<(value: V) => unknown>
): (value: V) => void {
  return (value: V) => fns.forEach((fn) => fn(value));
}
