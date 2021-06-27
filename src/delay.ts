export interface DelayId {
  readonly type: symbol;
  readonly id:
    | ReturnType<typeof globalThis.setTimeout>
    | ReturnType<typeof globalThis.requestAnimationFrame>;
}

export interface DelayFunction {
  (fn: FrameRequestCallback): DelayId;
  (fn: FrameRequestCallback, frames: 0): DelayId;
  (fn: VoidFunction, frames: number): DelayId;
}

/** Time of one frame in 60 FPS ratio. */
export const FRAME_TIME = 16.67;

const TIME_TYPE = Symbol('time');
const ANIMATION_TYPE = Symbol('animation');

/**
 * Lengthens function invocation at some frames.
 * If _frames_ equals to zero or less, then `requestAnimationFrame`
 * function is used.
 */
export const delay: DelayFunction = ((fn, frames: number = 0) =>
  'requestAnimationFrame' in globalThis && frames <= 0
    ? { type: ANIMATION_TYPE, id: globalThis.requestAnimationFrame(fn) }
    : {
        type: TIME_TYPE,
        id: globalThis.setTimeout(fn, frames * FRAME_TIME),
      }) as DelayFunction;

/** Cancels invocation of delayed function. */
export const cancelDelay = (stamp: DelayId): void =>
  stamp.type === ANIMATION_TYPE && 'cancelAnimationFrame' in globalThis
    ? globalThis.cancelAnimationFrame(stamp.id as number)
    : globalThis.clearTimeout(stamp.id as NodeJS.Timeout);
