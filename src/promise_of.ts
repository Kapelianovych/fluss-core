export function promiseOf<T>(value: T | PromiseLike<T>): Promise<T> {
  return value instanceof Error
    ? Promise.reject(value)
    : Promise.resolve(value);
}
