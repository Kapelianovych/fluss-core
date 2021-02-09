import { isPromise } from './is_promise';
import { isNothing } from './is_nothing';
import { either, Either, left, right } from './either';

const wrapResultWithEither = <L extends Error, R>(
  result: R
): R extends Promise<infer U> ? Promise<Either<L, U>> : Either<L, R> => {
  //@ts-ignore
  return isPromise(result) ? result.then(right, left) : either(result);
};

/**
 * Wraps code into `try/catch` and returns `Either` monad with result.
 * If `catchFn` is not `undefined`, then `Either` with result will
 * be returned, otherwise - `Either` with error.
 */
export const tryCatch = <T extends ReadonlyArray<unknown>, L extends Error, R>(
  tryFn: (...inputs: T) => R,
  catchFn?: (error: L) => R
): ((
  ...inputs: T
) => R extends Promise<infer U> ? Promise<Either<L, U>> : Either<L, R>) => {
  // @ts-ignore
  return (...inputs: T) => {
    try {
      return wrapResultWithEither<L, R>(tryFn(...inputs));
    } catch (error) {
      return isNothing(catchFn)
        ? left<L, R>(error)
        : wrapResultWithEither<L, R>(catchFn(error));
    }
  };
};
