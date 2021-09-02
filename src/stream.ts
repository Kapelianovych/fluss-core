import { isObject } from './is_object';
import { isFunction } from './is_function';
import type { Typeable } from './types';

export interface StreamListener<T> {
  (value: T): void;
}

export enum StreamEvent {
  FREEZE = 'freeze',
  RESUME = 'resume',
  DESTROY = 'destroy',
}

export const STREAM_OBJECT_TYPE = '$Stream';

/** Structure that makes operations with values over time in live mode. */
export interface Stream<T> extends Typeable {
  /**
   * Define listener to specific event of this stream.
   * @returns function that detach _listener_ from
   * _event_ of this stream.
   */
  on(event: StreamEvent, listener: VoidFunction): VoidFunction;
  map<R>(fn: (value: T) => R): Stream<R>;
  /** Send _value_ to stream. */
  send(value: T): Stream<T>;
  concat(other: Stream<T>): Stream<T>;
  /**
   * Listen to every value that is passed through stream.
   *
   * @returns function that stops listener from observing stream.
   */
  listen(listener: StreamListener<T>): VoidFunction;
  filter(predicate: (value: T) => boolean): Stream<T>;
  /**
   * Temporarily forbids stream to accept new values and listeners.
   * In contrary of `destroy` method, this method does not remove
   * old listeners.
   */
  freeze(): Stream<T>;
  /**
   * Creates new (**derived**) stream that depends on current stream.
   * Allow to create custom transform methods that maps over values
   * of current stream and sends it to derived stream.
   */
  derive<R>(fn: (derived: Stream<R>) => StreamListener<T>): Stream<R>;
  /**
   * Return to stream ability to accept listeners, values
   * and processing them.
   */
  resume(): Stream<T>;
  /**
   * Destroys stream. Stream gets rid of all listeners and
   * will be incapable to accept new values and listeners.
   *
   * Stream can be resumed by `resume` method, but listeners
   * need to be attached to stream again.
   */
  destroy(): Stream<T>;
  uniqueBy<F>(fn: (value: T) => F): Stream<T>;
}

interface StreamCreationOptions<T> {
  /**
   * Flag that tells if Stream has been able to pass
   * through itself values.
   *
   * If value is `false`, then stream cannot accept new values,
   * value listeners, destroy listeners and any derived streams
   * will never receive values from destroyed stream.
   */
  _isActive: boolean;
  _valueListeners: Map<StreamListener<T>, StreamListener<T>>;
  _freezeListeners: Map<VoidFunction, VoidFunction>;
  _resumeListeners: Map<VoidFunction, VoidFunction>;
  _destroyListeners: Map<VoidFunction, VoidFunction>;
}

const createStream = <T>(
  options: StreamCreationOptions<T> = {
    _isActive: true,
    _valueListeners: new Map(),
    _destroyListeners: new Map(),
    _freezeListeners: new Map(),
    _resumeListeners: new Map(),
  },
): Stream<T> => {
  const listen = (listener: StreamListener<T>): VoidFunction => {
    if (options._isActive) {
      options._valueListeners.set(listener, listener);
      return () => options._valueListeners.delete(listener);
    } else {
      return () => {};
    }
  };

  const derive = <R>(
    fn: (derived: Stream<R>) => StreamListener<T>,
  ): Stream<R> => {
    const derived = createStream<R>();
    derived.on(StreamEvent.DESTROY, listen(fn(derived)));
    return derived;
  };

  return {
    on: (event, listener) => {
      if (options._isActive) {
        switch (event) {
          case StreamEvent.FREEZE:
            options._freezeListeners.set(listener, listener);
            return () => options._freezeListeners.delete(listener);
          case StreamEvent.RESUME:
            options._resumeListeners.set(listener, listener);
            return () => options._resumeListeners.delete(listener);
          case StreamEvent.DESTROY:
            options._destroyListeners.set(listener, listener);
            return () => options._destroyListeners.delete(listener);
          default:
            return () => {};
        }
      }

      return () => {};
    },
    map: (fn) => derive((derived) => (value) => derived.send(fn(value))),
    send: (value) => {
      if (options._isActive) {
        options._valueListeners.forEach((fn) => fn(value));
      }

      return createStream(options);
    },
    filter: (predicate) =>
      derive((derived) => (value) => {
        if (predicate(value)) {
          derived.send(value);
        }
      }),
    uniqueBy: (fn) => {
      const unique = new Set();

      return derive((derived) => (value) => {
        const key = fn(value);
        if (!unique.has(key)) {
          unique.add(key);
          derived.send(value);
        }
      });
    },
    concat: (other) => {
      const concatenated = createStream<T>();
      concatenated.on(StreamEvent.DESTROY, listen(concatenated.send));
      concatenated.on(StreamEvent.DESTROY, other.listen(concatenated.send));
      return concatenated;
    },
    freeze: () => {
      options._freezeListeners.forEach((fn) => fn());
      options._isActive = false;

      return createStream(options);
    },
    resume: () => {
      options._isActive = true;
      options._resumeListeners.forEach((fn) => fn());

      return createStream(options);
    },
    destroy: () => {
      options._destroyListeners.forEach((fn) => fn());

      options._isActive = false;
      options._valueListeners = new Map();
      options._freezeListeners = new Map();
      options._resumeListeners = new Map();
      options._destroyListeners = new Map();

      return createStream(options);
    },
    derive,
    listen,
    type: () => STREAM_OBJECT_TYPE,
  };
};

/** Creates live stream. */
export const stream = <T>(): Stream<T> => createStream<T>();

/** Check if _value_ is instance of `Stream` monad. */
export const isStream = <T>(value: unknown): value is Stream<T> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  (value as Typeable).type() === STREAM_OBJECT_TYPE;
