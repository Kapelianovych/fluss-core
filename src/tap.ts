import { isPromise } from './is_promise.js';

/** Performs side effect on value while returning it as is. */
export const tap =
  <T>(effect: (value: T) => void | Promise<void>) =>
  (value: T): T => {
    effect(value);
    return value;
  };

export const awaitedTap =
  <T, R extends void | Promise<void>>(effect: (value: T) => R) =>
  (value: T): R extends void ? T : Promise<T> => {
    const result = effect(value);

    return (isPromise(result) ? result.then(() => value) : value) as any;
  };
