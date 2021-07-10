/**
 * Invokes _fn_ only once.
 * If _after_ function is provided, then
 * it will be called after _fn_ has been executed.
 */
export const once = <F extends (...args: ReadonlyArray<unknown>) => unknown>(
  fn: F,
  after?: F
): F => {
  let result: ReturnType<F>;
  let _fn = fn;

  return ((...args) => {
    result = _fn(...args) as ReturnType<F>;
    _fn = after ?? ((() => result) as F);
    return result;
  }) as F;
};
