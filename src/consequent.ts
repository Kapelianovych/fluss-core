import { isPromise } from './is_promise';
import { maybe, none, Option, some } from './option';

export interface ConsequentFunction<
  F extends (...args: ReadonlyArray<unknown>) => unknown
> {
  /** Signals if this function is executing now. */
  readonly busy: boolean;
  (...args: Parameters<F>): Option<ReturnType<F>>;
}

/**
 * Executes function while it is not in process.
 * Also handles asynchronous functions.
 */
export const consequent = <
  F extends (...args: ReadonlyArray<unknown>) => unknown
>(
  fn: F
): ConsequentFunction<F> => {
  let busy = false;

  const wrapperFunction = ((...args) => {
    if (!busy) {
      busy = true;

      const result = fn(...args);

      return isPromise(result)
        ? some(result.then((value) => ((busy = false), value)))
        : ((busy = false), maybe(result));
    } else {
      return none;
    }
  }) as ConsequentFunction<F>;

  Reflect.defineProperty(wrapperFunction, 'busy', {
    get: () => busy,
    enumerable: false,
    configurable: false,
  });

  return wrapperFunction;
};
