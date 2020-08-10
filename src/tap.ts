export function tap<T>(value: T, fn: (value: Readonly<T>) => any): T {
  fn(Object.freeze(value));
  return value;
}
