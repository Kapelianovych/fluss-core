/** Checks if value is `Promise`. */
export const isPromise = <T>(value: any): value is Promise<T> => {
  return value instanceof Promise;
};
