import { arrayFrom } from './array_from';
import { isNothing } from './is_nothing';

export function reduce<U>(
  iterable: ArrayLike<U> | Iterable<U>,
  fn: (accumulator: U, item: U, index: number) => U
): U;
export function reduce<T, U>(
  iterable: ArrayLike<U> | Iterable<U>,
  fn: (accumulator: T, item: U, index: number) => T,
  initial: T
): T;
export function reduce<T, U>(
  iterable: ArrayLike<U> | Iterable<U>,
  fn: (accumulator: T | U, item: U, index: number) => T,
  initial?: T
): T | U {
  const iterableArray = arrayFrom(iterable);
  const initialValue = isNothing(initial) ? iterableArray[0] : initial;
  return (isNothing(initial) ? iterableArray.slice(1) : iterableArray).reduce(
    fn,
    initialValue
  );
}
