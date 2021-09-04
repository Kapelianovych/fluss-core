/** Performs side effect on value while returning it as is. */
export const tap =
  <T>(effect: (value: T) => void | Promise<void>) =>
  (value: T): T => {
    effect(value);
    return value;
  };
