import { Nothing } from './utilities';

/** Checks if value is `null` or `undefined`. */
export function isNothing<T>(value: T | Nothing): value is Nothing {
  return value === null || value === undefined;
}
