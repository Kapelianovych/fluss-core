import { isPromise } from './is_promise';
import { isNothing } from './is_just_nothing';
import { Either, left, right } from './either';

export interface TryCatchFunction {
  <T extends ReadonlyArray<any>, L extends Error, R>(
    tryFn: (...inputs: T) => R
  ): (
    ...args: T
  ) => R extends Promise<infer U> ? Promise<Either<L, U>> : Either<L, R>;
  <T extends ReadonlyArray<any>, L extends Error, R>(
    tryFn: (...inputs: T) => R,
    catchFn: (error: L) => R
  ): (...args: T) => R;
}

/**
 * Catches error that may occur in _tryFn_ function.
 * If _catchFn_ is defined, then result will be returned.
 * Otherwise, `Either` with an error or result.
 */
export const tryCatch: TryCatchFunction =
  <T extends ReadonlyArray<any>, L extends Error, R>(
    tryFn: (...inputs: T) => R,
    catchFn?: (error: L) => R
  ) =>
  (...inputs: T) => {
    try {
      const result = tryFn(...inputs);
      return isPromise<R>(result)
        ? isNothing(catchFn)
          ? result.then(right, left)
          : result.catch(catchFn)
        : isNothing(catchFn)
        ? right(result)
        : result;
    } catch (error) {
      return isNothing(catchFn) ? left<L>(error) : catchFn(error);
    }
  };
