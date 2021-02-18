import { isNothing } from './is_nothing';
import type { Comonad, Monad } from './types';

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
  /** Queues a function to be called during a interpretator's idle periods. */
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

/** Monad that allow to defer data initialization. */
class Idle<T> implements Comonad<T>, Monad<T> {
  private _fn: () => T;
  private _value: T | undefined;
  private _handle: IdleCallbackHandle;

  private constructor(fn: () => T) {
    this._fn = fn;
    this._handle = deferCallback(() => (this._value = fn()));
  }

  /**
   * Queues a data returned by `fn` to be evaluated
   * at interpretator's idle period.
   */
  static idle<T>(fn: () => T): Idle<T> {
    return new Idle<T>(fn);
  }

  map<R>(fn: (value: T) => R): Idle<R> {
    return new Idle<R>(() => fn(this.extract()));
  }

  chain<R>(fn: (value: T) => Idle<R>): Idle<R> {
    return fn(this.extract());
  }

  apply<R>(other: Idle<(value: T) => R>): Idle<R> {
    return new Idle<R>(() => other.extract()(this.extract()));
  }

  extract(): T {
    if (isNothing(this._value)) {
      cancelCallback(this._handle);
      this._value = this._fn();
    }

    return this._value;
  }
}

export type { Idle };
export const { idle } = Idle;

/** Check if _value_ is idle. */
export const isIdle = <T>(value: unknown): value is Idle<T> =>
  value instanceof Idle;
