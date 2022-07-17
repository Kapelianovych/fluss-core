/** Inverse a result of the *fn* parameter. */
export const not =
  <Params extends readonly unknown[]>(fn: (...params: Params) => boolean) =>
  (...args: Params) =>
    !fn(...args);
