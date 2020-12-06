/** Creates readonly type from set of elements. */
export function tuple<V>(v: V): readonly [V];
export function tuple<V, V1>(v: V, v1: V1): readonly [V, V1];
export function tuple<V, V1, V2>(v: V, v1: V1, v2: V2): readonly [V, V1, V2];
export function tuple<V, V1, V2, V3>(
  v: V,
  v1: V1,
  v2: V2,
  v3: V3
): readonly [V, V1, V2, V3];
export function tuple<V, V1, V2, V3, V4>(
  v: V,
  v1: V1,
  v2: V2,
  v3: V3,
  v4: V4
): readonly [V, V1, V2, V3, V4];
export function tuple(...args: ReadonlyArray<any>): ReadonlyArray<any> {
  return Object.freeze(args);
}
