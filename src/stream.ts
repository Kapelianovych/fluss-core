import { isJust } from './is_just_nothing';
import { isObject } from './is_object';
import { isFunction } from './is_function';
import type { Just } from './utilities';
import type { Typeable } from './types';

export interface StreamListener<T> {
  (value: T): void;
}

export enum StreamEvent {
  FREEZE = 'freeze',
  RESUME = 'resume',
  DESTROY = 'destroy',
}

export const STREAM_OBJECT_TYPE = 'Stream';

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
   * Temporarily forbids stream to accept new values and listeners.
   * In contrary of `destroy` method, this method does not remove
   * old listeners.
   */
  freeze(): void;
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
  resume(): void;
  /**
   * Destroys stream. Stream gets rid of all listeners and
   * will be uncapable to accept new values and listeners.
   *
   * Stream can be resumed by `resume` method, but listeners
   * need to be attached to stream again.
   */
  destroy(): void;
  uniqueBy<F>(fn: (value: T) => F): Stream<T>;
  /** Get rid of `Nothing` values. */
  compress(): Stream<Just<T>>;
}

/** Creates live stream. */
export const stream = <T>(): Stream<T> => {
  /**
   * Flag that tells if Stream has been able to pass
   * through itself values.
   *
   * If value is `false`, then stream cannot accept new values,
   * value listeners, destroy listeners and any derived streams
   * will never recieve values from destroyed stream.
   */
  let _isActive: boolean = true;
  let _valueListeners: Array<StreamListener<T>> = [];
  let _freezeListeners: Array<VoidFunction> = [];
  let _resumeListeners: Array<VoidFunction> = [];
  let _destroyListeners: Array<VoidFunction> = [];

  const listen = (listener: StreamListener<T>): VoidFunction => {
    if (_isActive) {
      _valueListeners.push(listener);
      return () => {
        _valueListeners = _valueListeners.filter((fn) => fn !== listener);
      };
    } else {
      return () => {};
    }
  };

  const derive = <R>(
    fn: (derived: Stream<R>) => StreamListener<T>
  ): Stream<R> => {
    const derived = stream<R>();
    derived.on(StreamEvent.DESTROY, listen(fn(derived)));
    return derived;
  };

  return {
    on: (event, listener) => {
      if (_isActive) {
        switch (event) {
          case StreamEvent.FREEZE:
            _freezeListeners.push(listener);
            return () => {
              _freezeListeners = _freezeListeners.filter(
                (fn) => fn !== listener
              );
            };
          case StreamEvent.RESUME:
            _resumeListeners.push(listener);
            return () => {
              _resumeListeners = _resumeListeners.filter(
                (fn) => fn !== listener
              );
            };
          case StreamEvent.DESTROY:
            _destroyListeners.push(listener);
            return () => {
              _destroyListeners = _destroyListeners.filter(
                (fn) => fn !== listener
              );
            };
          default:
            return () => {};
        }
      }

      return () => {};
    },
    map: (fn) => derive((derived) => (value) => derived.send(fn(value))),
    send: (value) => {
      if (_isActive) {
        _valueListeners.forEach((fn) => fn(value));
      }
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
    compress: () =>
      derive((derived) => (value) => {
        if (isJust(value)) {
          derived.send(value);
        }
      }),
    concat: (other) => {
      const concatenated = stream<T>();
      concatenated.on(StreamEvent.DESTROY, listen(concatenated.send));
      concatenated.on(StreamEvent.DESTROY, other.listen(concatenated.send));
      return concatenated;
    },
    freeze: () => {
      _isActive = false;
      _freezeListeners.forEach((fn) => fn());
    },
    resume: () => {
      _isActive = true;
      _resumeListeners.forEach((fn) => fn());
    },
    destroy: () => {
      _isActive = false;
      _destroyListeners.forEach((fn) => fn());

      _valueListeners = [];
      _freezeListeners = [];
      _resumeListeners = [];
      _destroyListeners = [];
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
