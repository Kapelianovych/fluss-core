/** Time of one frame: **~16.67ms.** */
export const FRAME_TIME = 16.67;

const delay = (
  everyFrame: boolean
): ((fn: VoidFunction, time?: number) => number) =>
  'requestAnimationFrame' in globalThis && everyFrame
    ? globalThis.requestAnimationFrame
    : globalThis.setTimeout;

/**
 * Defines interval of function invocation based on amount of frames.
 * It ensures that after this time function will be invoked.
 * If _frames_ is set to `1` or less, then, if present, `requestAnimationFrame`
 * is used. Otherwise, `setTimeout` function is in use.
 */
export const throttle = <F extends (...args: ReadonlyArray<unknown>) => void>(
  fn: F,
  frames: number = 2
): F => {
  const time = frames * FRAME_TIME;
  const delayFunction = delay(frames <= 1);

  let busy = false;

  return ((...args: Parameters<F>): void => {
    if (!busy) {
      delayFunction(() => {
        fn(...args);
        busy = false;
      }, time);

      busy = true;
    }
  }) as F;
};
