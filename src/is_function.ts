/** Check if _value_ is a function. */
export const isFunction = <F extends Function>(value: unknown): value is F =>
  typeof value === 'function';
