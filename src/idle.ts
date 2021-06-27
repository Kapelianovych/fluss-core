import { isObject } from './is_object';
import { isNothing } from './is_just_nothing';
import { isFunction } from './is_function';
import type { Serializable, Typeable } from './types';

type IdleCallbackHandle = unknown;

type RequestIdleCallbackOptions = {
  timeout: number;
};

type IdleDeadline = {
  /** Determine if callback is executing because its timeout duration expired. */
  readonly didTimeout: boolean;
  /** Determine how much longer the user agent estimates it will remain idle. */
  timeRemaining: () => number;
};

declare global {
  /** Queues a function to be called during a interpreter's idle periods. */
  function requestIdleCallback(
    callback: (deadline: IdleDeadline) => void,
    opts?: RequestIdleCallbackOptions
  ): IdleCallbackHandle;
  /** Cancels a callback previously scheduled with `globalThis.requestIdleCallback()`. */
  function cancelIdleCallback(handle: IdleCallbackHandle): void;
}

// These functions are needed in order to provide fallbacks
// for environments that do not support `requestIdleCallback` and
// `cancelIdleCallback` functions.
const deferCallback = globalThis.requestIdleCallback ?? globalThis.setTimeout;
const cancelCallback = globalThis.cancelIdleCallback ?? globalThis.clearTimeout;

export const IDLE_OBJECT_TYPE = '$Idle';

/** Monad that allow to defer data initialization. */
export interface Idle<T> extends Typeable, Serializable<T> {
  map<R>(fn: (value: T) => R): Idle<R>;
  chain<R>(fn: (value: T) => Idle<R>): Idle<R>;
  apply<R>(other: Idle<(value: T) => R>): Idle<R>;
  extract(): T;
}

/**
 * Queues a data returned by `fn` to be evaluated
 * at interpretator's idle period.
 */
export const idle = <T>(fn: () => T): Idle<T> => {
  let value: T | undefined;
  const handle = deferCallback(() => (value = fn()));

  const extract = (): T => {
    if (isNothing(value)) {
      cancelCallback(handle);
      value = fn();
    }

    return value;
  };

  return {
    extract,
    type: () => IDLE_OBJECT_TYPE,
    map: (fn) => idle(() => fn(extract())),
    chain: (fn) => fn(extract()),
    apply: (other) => other.map((fn) => fn(extract())),
    toJSON: () => ({
      type: IDLE_OBJECT_TYPE,
      value: extract(),
    }),
  };
};

/** Check if _value_ is idle. */
export const isIdle = <T>(value: unknown): value is Idle<T> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  (value as Typeable).type() === IDLE_OBJECT_TYPE;
