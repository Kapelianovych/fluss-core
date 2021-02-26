import type { Just, Nothing } from './utilities';

/** Check if value is `null` or `undefined`. */
export const isNothing = <T>(value: T | Nothing): value is Nothing =>
  value === null || value === undefined;

/** Check if _value_ is not `null` and `undefined`. */
export const isJust = <T>(value: T): value is Just<T> => !isNothing(value);
