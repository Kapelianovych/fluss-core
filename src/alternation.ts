import { Maybe, nothing, maybe } from './maybe';

/**
 * Lets accomplish condition logic depending of function application.
 * If function returns `NaN`, `null` or `undefined`,
 * then result of next function is checked.
 * If no function return non-empty value, then result
 * of last function is returned.
 */
export function alternation<T extends ReadonlyArray<unknown>, R>(
  ...fns: ReadonlyArray<(...args: T) => R | null | undefined>
): (...args: T) => Maybe<R> {
  return (...args) => {
    let result = nothing<R>();

    for (const fn of fns) {
      if (result.isJust() && !Object.is(result.extract(), NaN)) {
        return result;
      }

      result = maybe(fn(...args));
    }

    return result;
  };
}
