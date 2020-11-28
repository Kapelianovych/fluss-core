/** Checks if value is `Promise`. */
export function isPromise<T>(value: any): value is Promise<T> {
  return value instanceof Promise;
}