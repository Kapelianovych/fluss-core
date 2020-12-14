import { isPromise } from './is_promise';
import { isNothing } from './is_nothing';
import { either, Either } from './either';

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
    function handleError(error: L): Either<L, R> | Promise<Either<L, R>> {
      if (!isNothing(catchFn)) {
        const fallbackResult = catchFn(error);
        return isPromise(fallbackResult)
          ? fallbackResult.then(
              (res) => either<L, R>(res),
              (error) => either<L, R>(error)
            )
          : either<L, R>(fallbackResult);
      } else {
        return either<L, R>(error);
      }
    }

    try {
      const result = tryFn(input);
      return isPromise(result)
        ? result.then((res) => either<L, R>(res), handleError)
        : either<L, R>(result);
    } catch (error) {
      return handleError(error);
    }
  };
}
