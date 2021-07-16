import { isPromise } from './is_promise';
import { isNothing } from './is_just_nothing';
import { Either, left, Right, right } from './either';

const wrapResultWithEither = <L extends Error, R>(
  result: R
): R extends Promise<infer U> ? Promise<Either<L, U>> : Right<R> => {
  // @ts-ignore
  return isPromise<R>(result) ? result.then(right, left) : right(result);
};

/**
 * Wraps code into `try/catch` and returns `Either` monad with result.
 * If `catchFn` is not `undefined`, then `Either` with result will
 * be returned, otherwise - `Either` with error.
 */
export const tryCatch = <T extends ReadonlyArray<any>, L extends Error, R>(
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
        ? left<L>(error)
        : wrapResultWithEither<L, R>(catchFn(error));
    }
  };
};
