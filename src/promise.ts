import { isError } from './is_error';

/**
 * Creates new resolved promise if value is not an error,
 * otherwise returns rejected promise.
 */
export function promise<T>(value: T | PromiseLike<T>): Promise<T> {
  return isError(value) ? Promise.reject(value) : Promise.resolve(value);
}
