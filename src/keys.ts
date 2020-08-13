export function keys(obj: object): ReadonlyArray<string> {
  return Object.freeze(Object.keys(obj));
}
