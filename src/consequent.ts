import { isPromise } from './is_promise.js';

export interface ConsequentFunction<
  F extends (...args: readonly any[]) => void | Promise<void>,
> {
  /** Signals if this function is executing now. */
  readonly busy: boolean;
  (...args: Parameters<F>): void | Promise<void>;
}

/**
 * Executes a function if it is idle.
 * Also handles asynchronous functions.
 */
export const consequent = <
  F extends (...args: readonly any[]) => void | Promise<void>,
>(
  fn: F,
): ConsequentFunction<F> => {
  let busy = false;

  const wrapperFunction = ((...args) => {
    if (!busy) {
      busy = true;

      const result = fn(...args);

      isPromise(result) ? result.then(() => (busy = false)) : (busy = false);
    }
  }) as ConsequentFunction<F>;

  Reflect.defineProperty(wrapperFunction, 'busy', {
    get: () => busy,
    enumerable: true,
    configurable: false,
  });

  return wrapperFunction;
};
