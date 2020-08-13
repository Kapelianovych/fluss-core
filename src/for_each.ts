import { arrayFrom } from './array_from';

export function forEach<U>(
  iterable: ArrayLike<U> | Iterable<U>,
  fn: (item: U, index: number) => void
): void {
  return arrayFrom(iterable).forEach(fn);
}
