/**
 * Invoke _fn_ only once.
 * If _after_ function is provided, then
 * it will be called after _fn_ has been executed.
 */
export const once = <T extends ReadonlyArray<unknown>>(
  fn: (...args: T) => void,
  after: (...args: T) => void = () => {}
) => {
  let done = false;
  return (...args: T) => (done ? after(...args) : ((done = true), fn(...args)));
};
