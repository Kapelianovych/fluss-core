import { isPromise } from './is_promise';
import { isNothing } from './is_nothing';
import { Either, left, right } from './either';

/**
 * Wraps code into `try/catch` and returns `Either` monad with result.
 * If `catchFn` is not `undefined`, then `Either` with result will
 * be returned, otherwise - `Either` with error.
 */
export function tryCatch<T, L extends Error, R>(
  tryFn: (input: T) => R,
  catchFn?: (error: L) => R
): (input: T) => Either<L, R>;
export function tryCatch<T, L extends Error, R>(
  tryFn: (input: T) => Promise<R>,
  catchFn?: (error: L) => Promise<R>
): (input: T) => Promise<Either<L, R>>;
export function tryCatch<T, L extends Error, R>(
  tryFn: (input: T) => R | Promise<R>,
  catchFn?: (error: L) => R | Promise<R>
): (input: T) => Either<L, R> | Promise<Either<L, R>> {
  return (input: T) => {
    try {
      return wrapResultWithEither<L, R>(tryFn(input));
    } catch (error) {
      return isNothing(catchFn)
        ? left<L, R>(error)
        : wrapResultWithEither<L, R>(catchFn(error));
    }
  };
}

function wrapResultWithEither<L extends Error, R>(
  result: R | Promise<R>
): Either<L, R> | Promise<Either<L, R>> {
  return isPromise<R>(result)
    ? result.then<Either<L, R>, Either<L, R>>(right, left)
    : right<L, R>(result);
}
