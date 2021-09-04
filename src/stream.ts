import { isObject } from './is_object';
import { isFunction } from './is_function';
import type { Filterable, Functor, Semigroup, Typeable } from './types';

export interface StreamListener<T> {
  (value: T): void;
}

export const STREAM_OBJECT_TYPE = '$Stream';

/** Structure that makes operations with values over time in live mode. */
export interface Stream<T>
  extends Typeable,
    Functor<T>,
    Semigroup<T>,
    Filterable<T> {
  map<R>(fn: (value: T) => R): Stream<R>;
  /** Send _value_ to stream. */
  send(value: T): void;
  concat(other: Stream<T>): Stream<T>;
  /**
   * Listen to every value that is passed through stream.
   *
   * @returns function that stops listener from observing stream.
   */
  listen(listener: StreamListener<T>): VoidFunction;
  filter(predicate: (value: T) => boolean): Stream<T>;
  /**
   * Creates new (**derived**) stream that depends on current stream.
   * Allow to create custom transform methods that maps over values
   * of current stream and sends it to derived stream.
   */
  derive<R>(fn: (derived: Stream<R>) => StreamListener<T>): Stream<R>;
}

/** Creates live stream. */
export const stream = <T>(): Stream<T> => {
  const _listeners = new Map();

  const listen = (listener: StreamListener<T>): VoidFunction => {
    _listeners.set(listener, listener);
    return () => _listeners.delete(listener);
  };

  const derive = <R>(
    fn: (derived: Stream<R>) => StreamListener<T>,
  ): Stream<R> => {
    const derived = stream<R>();
    listen(fn(derived));
    return derived;
  };

  return {
    map: (fn) => derive((derived) => (value) => derived.send(fn(value))),
    send: (value) => _listeners.forEach((fn) => fn(value)),
    filter: (predicate) =>
      derive((derived) => (value) => {
        if (predicate(value)) {
          derived.send(value);
        }
      }),
    concat: (other) => {
      const concatenated = stream<T>();
      listen(concatenated.send);
      other.listen(concatenated.send);
      return concatenated;
    },
    derive,
    listen,
    type: () => STREAM_OBJECT_TYPE,
  };
};

/** Check if _value_ is instance of `Stream` monad. */
export const isStream = <T>(value: unknown): value is Stream<T> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  (value as Typeable).type() === STREAM_OBJECT_TYPE;
