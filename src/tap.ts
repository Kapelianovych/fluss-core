export function tap<T>(value: T, fn: (value: Readonly<T>) => any): T {
  fn(value);
  return value;
}
