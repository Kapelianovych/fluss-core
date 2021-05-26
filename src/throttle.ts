const FRAME_TIME = 16.67;

const delay = (
  everyFrame: boolean
): ((fn: VoidFunction, time?: number) => number) =>
  'requestAnimationFrame' in globalThis && everyFrame
    ? globalThis.requestAnimationFrame
    : globalThis.setTimeout;

/**
 * Delay function invocation based on amount of frames.
 * It ensures that after this time function will be invoked.
 */
export const throttle = <F extends (...args: ReadonlyArray<unknown>) => void>(
  fn: F,
  frames: number = 2
): F =>
  ((...args: Parameters<F>): void => {
    let busy = false;

    if (!busy) {
      delay(frames === 0 || frames === 1)(() => {
        fn(...args);
        busy = false;
      }, frames * FRAME_TIME);

      busy = true;
    }
  }) as F;
