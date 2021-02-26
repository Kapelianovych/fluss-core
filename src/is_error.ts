import type { Constructor } from './utilities';

/**
 * Check if value is instance of `Error` class
 * or (optionally) its child classes.
 */
export const isError = <E extends Error>(
  value: unknown,
  childClass?: Constructor<E>
): value is E => value instanceof (childClass ?? Error);
