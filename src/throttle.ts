import { delay } from './delay.js';

/** Makes a function to be executed once per _frames_ count. */
export const throttle = <F extends (...args: readonly any[]) => void>(
  fn: F,
  frames = 0,
): ((...args: Parameters<F>) => void) => {
  let delayed = false;

  return (...args) => {
    if (!delayed) {
      delayed = true;
      fn(...args);
      delay(() => (delayed = false), frames);
    }
  };
};
