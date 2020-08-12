export function tupleOf<V>(v: V): readonly [V];
export function tupleOf<V, V1>(v: V, v1: V1): readonly [V, V1];
export function tupleOf<V, V1, V2>(v: V, v1: V1, v2: V2): readonly [V, V1, V2];
export function tupleOf<V, V1, V2, V3>(
  v: V,
  v1: V1,
  v2: V2,
  v3: V3
): readonly [V, V1, V2, V3];
export function tupleOf<V, V1, V2, V3, V4>(
  v: V,
  v1: V1,
  v2: V2,
  v3: V3,
  v4: V4
): readonly [V, V1, V2, V3, V4];
export function tupleOf(...args: ReadonlyArray<any>): ReadonlyArray<any> {
  return Object.freeze(args);
}
