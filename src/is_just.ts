import type { Just } from './utilities.js';

/** Check if _value_ is not `null` and `undefined`. */
export const isJust = <T>(value: T): value is Just<T> =>
  value !== null && value !== undefined;
