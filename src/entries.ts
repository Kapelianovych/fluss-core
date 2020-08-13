export function entries<V>(
  obj: { [key: string]: V } | ArrayLike<V> | Set<V>
): ReadonlyArray<[string, V]> {
  return Object.freeze(
    obj instanceof Set
      ? [...obj.entries()].map(([key, value]) => [String(key), value])
      : Object.entries(obj)
  );
}
