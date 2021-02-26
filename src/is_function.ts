/** Check if _value_ is function. */
export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function';
