import { isJust } from './is_just.js';
import { isObject } from './is_object.js';

// These functions are needed in order to provide fallbacks
// for environments that do not support `requestIdleCallback` and
// `cancelIdleCallback` functions.
const deferCallback = globalThis.requestIdleCallback ?? globalThis.setTimeout;
const cancelCallback = globalThis.cancelIdleCallback ?? globalThis.clearTimeout;

export const IDLE_TYPE = '__$Idle';

/** Monad that allow to defer data initialization. */
export type Idle<T> = {
  readonly [IDLE_TYPE]: null;

  readonly map: <R>(fn: (value: T) => R) => Idle<R>;
  readonly chain: <R>(fn: (value: T) => Idle<R>) => Idle<R>;
  readonly apply: <R>(other: Idle<(value: T) => R>) => Idle<R>;
  readonly toJSON: () => { readonly type: string; readonly value: T };
  readonly extract: () => T;
};

/**
 * Queues a data returned by `fn` to be evaluated
 * at interpreter's idle period.
 */
export const Idle = <T>(fn: () => T): Idle<T> => {
  let value: T | undefined;
  const handle = deferCallback(() => (value = fn()));

  const extract = (): T => {
    if (isJust(value)) {
      return value;
    }

    cancelCallback(handle);

    return (value = fn());
  };

  return {
    [IDLE_TYPE]: null,

    map: (fn) => Idle(() => fn(extract())),
    chain: (fn) => fn(extract()),
    apply: (other) => other.map((fn) => fn(extract())),
    extract,
    toJSON: () => ({
      type: IDLE_TYPE,
      value: extract(),
    }),
  };
};

/** Checks if the _value_ is an *Idle* object. */
export const isIdle = <T>(value: unknown): value is Idle<T> =>
  isObject(value) && IDLE_TYPE in value;
