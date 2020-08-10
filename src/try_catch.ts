import { isPromise } from './is_promise';
import { isNothing } from './is_nothing';
import { eitherOf, Either } from './either';

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
          ? fallbackResult
              .then((res) => eitherOf<L, R>(res))
              .catch((error) => eitherOf<L, R>(error))
          : eitherOf<L, R>(fallbackResult);
      } else {
        return eitherOf<L, R>(error);
      }
    }

    try {
      const result = tryFn(input);
      return isPromise(result)
        ? result.then((res) => eitherOf<L, R>(res)).catch(handleError)
        : eitherOf<L, R>(result);
    } catch (error) {
      return handleError(error);
    }
  };
}
