/**
 * Check if value is instance of `Error` class
 * or (optionally) its child classes.
 */
export const isError = <E extends ErrorConstructor>(
  value: unknown,
  childClass?: E
): value is InstanceType<E> => value instanceof (childClass ?? Error);
