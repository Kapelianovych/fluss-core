export function tap<T>(fn: (value: Readonly<T>) => any): (a: T) => T {
  return (value: T) => {
    fn(value);
    return value;
  };
}
