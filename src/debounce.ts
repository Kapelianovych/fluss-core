import { isNothing } from './is_just_nothing';
import { delay, Delay } from './delay';

/**
 * Delays function invocation for _frames_ from last invocation
 * of debounced function. If interval between invocations will
 * be less than _frames_, then original function won't be
 * executed.
 */
export const debounce = <F extends (...args: ReadonlyArray<any>) => void>(
  fn: F,
  frames = 0
): F => {
  let delayStamp: Delay<void> | undefined;

  return ((...args: Parameters<F>) => {
    if (!isNothing(delayStamp)) {
      delayStamp.cancel();
    }
    delayStamp = delay(() => fn(...args), frames);
  }) as F;
};
