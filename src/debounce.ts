import { delay, Delay } from './delay.js';

/**
 * Delays function invocation for _frames_ from last invocation
 * of debounced function. If interval between invocations will
 * be less than _frames_, then original function won't be
 * executed.
 */
export const debounce = <F extends (...args: readonly any[]) => void>(
  fn: F,
  frames = 0,
): ((...args: Parameters<F>) => void) => {
  let delayStamp: Delay<void> | undefined;

  return (...args: Parameters<F>) => {
    delayStamp?.cancel();
    delayStamp = delay(() => fn(...args), frames);
  };
};
