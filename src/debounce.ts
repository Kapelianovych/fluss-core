import { isNothing } from './is_just_nothing';
import { cancelDelay, delay, DelayId } from './delay';

/**
 * Delays function invocation for _frames_ from last invocation
 * of debounced function. If interval between invocations will
 * be less than _frames_, then original function won't be
 * executed.
 */
export const debounce = <
  F extends (...args: ReadonlyArray<unknown>) => void | Promise<void>
>(
  fn: F,
  frames = 0
): F => {
  let delayId: DelayId | undefined;

  return ((...args: Parameters<F>) => {
    if (!isNothing(delayId)) {
      cancelDelay(delayId);
    }
    delayId = delay(() => fn(...args), frames);
  }) as F;
};
