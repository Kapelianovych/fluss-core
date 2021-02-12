/** Checks if value is `Promise`. */
export const isPromise = <T>(value: any): value is Promise<T> =>
  value instanceof Promise;
