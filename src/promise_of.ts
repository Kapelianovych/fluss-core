export function promiseOf<T extends Error>(value: T): Promise<never>;
export function promiseOf<T>(value: T | PromiseLike<T>): Promise<T>;
export function promiseOf<T>(
  value: T | PromiseLike<T> | Error
): Promise<T | never> {
  return value instanceof Error
    ? Promise.reject(value)
    : Promise.resolve(value);
}
