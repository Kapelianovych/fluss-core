/** Checks if value is `null` or `undefined`. */
export function isNothing<T>(
  value: T | null | undefined
): value is undefined | null {
  return value === null || value === undefined;
}