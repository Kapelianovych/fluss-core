export function tap<T>(value: T, fn: (value: T) => any): T {
  fn(value);
  return value;
}
