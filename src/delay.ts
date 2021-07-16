import { isObject } from './is_object';

interface InternalDelayId {
  readonly type: symbol;
  readonly id:
    | ReturnType<typeof globalThis.setTimeout>
    | ReturnType<typeof globalThis.requestAnimationFrame>;
}

interface DelayFunction {
  (fn: FrameRequestCallback): InternalDelayId;
  (fn: FrameRequestCallback, frames: 0): InternalDelayId;
  (fn: VoidFunction, frames: number): InternalDelayId;
}

/** Time of one frame in 60 FPS ratio. */
export const FRAME_TIME = 16.67;

const TIME_TYPE = Symbol('time');
const DELAY_SYMBOL = Symbol('Delay');
const ANIMATION_TYPE = Symbol('animation');
const CLEARING_SIGNAL = Symbol('Clear delay');

const internalDelay: DelayFunction = ((fn, frames: number) =>
  'requestAnimationFrame' in globalThis && frames <= 0
    ? { type: ANIMATION_TYPE, id: globalThis.requestAnimationFrame(fn) }
    : {
        type: TIME_TYPE,
        id: globalThis.setTimeout(fn, frames * FRAME_TIME),
      }) as DelayFunction;

const internalCancelDelay = (stamp: InternalDelayId): void =>
  stamp.type === ANIMATION_TYPE && 'cancelAnimationFrame' in globalThis
    ? globalThis.cancelAnimationFrame(stamp.id as number)
    : globalThis.clearTimeout(stamp.id as NodeJS.Timeout);

export interface Delay<T> {
  readonly _$id: symbol;
  readonly _$clear: VoidFunction;

  readonly result: Promise<T | void>;
}

/**
 * Lengthens function invocation at some frames.
 * If _frames_ equals to zero or less, then `requestAnimationFrame`
 * function is used.
 */
export const delay = <T>(fn: () => T, frames = 0): Delay<T> => {
  let _$clear: VoidFunction = () => {};

  const _internalTask = new Promise<T>((resolve, reject) => {
    const delayId = internalDelay(() => {
      try {
        resolve(fn());
      } catch (error) {
        reject(error);
      }
    }, frames);
    _$clear = () => (internalCancelDelay(delayId), reject(CLEARING_SIGNAL));
  });

  return {
    _$id: DELAY_SYMBOL,
    _$clear,
    result: _internalTask.catch((error) => {
      if (error !== CLEARING_SIGNAL) {
        throw error;
      }
    }),
  };
};

/** Cancels invocation of delayed function. */
export const cancelDelay = (value: unknown): void =>
  void (
    isObject(value) &&
    (value as Delay<unknown>)._$id === DELAY_SYMBOL &&
    (value as Delay<unknown>)._$clear()
  );
