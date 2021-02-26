/** Check if _value_ is object type. */
export const isObject = (value: unknown): value is object =>
  value !== null && typeof value === 'object';
