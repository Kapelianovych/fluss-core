export function sequence<V>(
  value: V,
  ...fns: ReadonlyArray<(value: V) => any>
): void {
  fns.forEach((fn) => fn(value));
}
