import { delay } from './delay';

/** Makes function be executed once per _frames_ count. */
export const throttle = <F extends (...args: ReadonlyArray<any>) => void>(
  fn: F,
  frames = 0
): F => {
  let delayed = false;

  return ((...args: Parameters<F>): void => {
    if (!delayed) {
      delayed = true;
      fn(...args);
      delay(() => (delayed = false), frames);
    }
  }) as F;
};
