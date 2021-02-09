import type { Constructor } from './utilities';

/**
 * Check if value is instance of `Error` class
 * or (optionally) its child classes.
 */
export const isError = <E extends Error>(
  value: any,
  childClass?: Constructor<E>
): value is E => {
  return value instanceof (childClass ?? Error);
};
