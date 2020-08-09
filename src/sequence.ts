export function sequence<V>(
  ...fns: ReadonlyArray<(value: V) => any>
): (value: V) => void {
  return (value: V): void => {
    fns.forEach((fn) => fn(value));
  };
}
