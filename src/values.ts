export function values<T>(
  obj: { [key: string]: T } | ArrayLike<T> | Map<any, T> | Set<T>
): ReadonlyArray<T> {
  return Object.freeze(
    obj instanceof Set || obj instanceof Map
      ? [...obj.values()]
      : Object.values(obj)
  );
}
