import { isError } from './is_error';
import { isPromise } from './is_promise';

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
const ANIMATION_TYPE = Symbol('animation');

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

interface DelayBase {
  /** Cancels invocation of delayed function. */
  cancel: VoidFunction;
}

interface DelayResolved<T> extends DelayBase {
  readonly canceled: false;
  readonly result: Promise<T>;
}

interface DelayCanceled extends DelayBase {
  readonly canceled: true;
  readonly result: Promise<void>;
}

export type Delay<T> = DelayCanceled | DelayResolved<T>;

const catchError = <T>(
  result: T,
  resolve: (value: T) => void,
  reject: (error?: Error) => void
) => (isError(result) ? reject(result) : resolve(result));

/**
 * Lengthens function invocation at some frames.
 * If _frames_ equals to zero or less, then `requestAnimationFrame`
 * function is used.
 */
export const delay = <T>(fn: () => T | Promise<T>, frames = 0): Delay<T> => {
  let _$clear: VoidFunction = () => {};
  let _canceled = false;

  const _internalTask: Promise<any> = new Promise((resolve, reject) => {
    const delayId = internalDelay(() => {
      try {
        const result = fn();
        isPromise<T>(result)
          ? result.then((value) => catchError(value, resolve, reject), reject)
          : catchError(result, resolve, reject);
      } catch (error) {
        reject(error);
      }
    }, frames);

    _$clear = () =>
      void (
        !_canceled &&
        (internalCancelDelay(delayId), (_canceled = true), resolve(undefined))
      );
  });

  return {
    get canceled() {
      return _canceled;
    },
    get cancel() {
      return _$clear;
    },
    get result() {
      return _internalTask;
    },
  };
};
