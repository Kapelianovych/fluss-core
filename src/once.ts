import { Just } from './utilities';
import { isNothing } from './is_just_nothing';
import { maybe, none, Option } from './option';

interface OnceFunction {
  <T extends ReadonlyArray<unknown>, R>(fn: (...args: T) => R): (
    ...args: T
  ) => Option<Just<R>>;
  <T extends ReadonlyArray<unknown>, R>(
    fn: (...args: T) => R,
    after: (...args: T) => R
  ): (...args: T) => R;
}

/**
 * Invokes _fn_ only once.
 * If _after_ function is provided, then
 * it will be called after _fn_ has been executed.
 */
export const once: OnceFunction = <T extends ReadonlyArray<unknown>, R>(
  fn: (...args: T) => R,
  after?: (...args: T) => R
) => {
  let done = false;

  return (...args: T) => {
    if (done) {
      return isNothing(after) ? none : after(...args);
    } else {
      done = true;
      return isNothing(after) ? maybe(fn(...args)) : fn(...args);
    }
  };
};
