import { isError } from './is_error';
import { isPromise } from './is_promise';

interface InternalDelayId {
  readonly type: symbol;
  readonly id:
    | ReturnType<typeof globalThis.setTimeout>
    | ReturnType<typeof globalThis.requestAnimationFrame>;
}

/** Time of one frame in 60 FPS ratio. */
export const FRAME_TIME = 16.67;

const TIME_TYPE = Symbol('time');
const ANIMATION_TYPE = Symbol('animation');

const internalDelay = (fn: VoidFunction, frames: number): InternalDelayId =>
  'requestAnimationFrame' in globalThis && frames <= 0
    ? { type: ANIMATION_TYPE, id: globalThis.requestAnimationFrame(fn) }
    : {
        type: TIME_TYPE,
        id: globalThis.setTimeout(fn, frames * FRAME_TIME),
      };

const internalCancelDelay = (stamp: InternalDelayId): void =>
  stamp.type === ANIMATION_TYPE && 'cancelAnimationFrame' in globalThis
    ? globalThis.cancelAnimationFrame(stamp.id as number)
    : globalThis.clearTimeout(stamp.id as NodeJS.Timeout);

interface DelayBase {
  /** Cancels invocation of delayed function. */
  cancel: VoidFunction;
}

interface DelayResolved<T> extends DelayBase {
  readonly result: Promise<T>;
  readonly canceled: false;
}

interface DelayCanceled extends DelayBase {
  readonly result: Promise<void>;
  readonly canceled: true;
}

export type Delay<T> = DelayCanceled | DelayResolved<T>;

const catchError = <T>(
  result: T,
  resolve: (value: T) => void,
  reject: (error?: Error) => void,
) => (isError(result) ? reject(result) : resolve(result));

/**
 * Lengthens function invocation at some frames.
 * If _frames_ equals to zero or less, then `requestAnimationFrame`
 * function is used.
 */
export const delay = <T>(
  fn: () => T | Promise<T>,
  frames: number = 0,
): Delay<T> => {
  let _$clear: VoidFunction = () => {};
  let _$canceled = false;

  const _$internalTask: Promise<any> = new Promise((resolve, reject) => {
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
        !_$canceled &&
        (internalCancelDelay(delayId), (_$canceled = true), resolve(undefined))
      );
  });

  return {
    get canceled() {
      return _$canceled;
    },
    get cancel() {
      return _$clear;
    },
    get result() {
      return _$internalTask;
    },
  };
};
