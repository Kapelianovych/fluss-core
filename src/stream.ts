import type { Filterable, Functor } from './types';

/** Structure that makes operations with values over time in live mode. */
class Stream<T> implements Functor<T>, Filterable<T> {
  /**
   * Flag that tells if Stream has been able to pass
   * through itself values.
   *
   * If value is `false`, then stream cannot accept new values,
   * value listeners, destroy listeners and any derived streams
   * will never recieve values from destroyed stream.
   */
  private _isActive: boolean = true;
  private _valueListeners: ReadonlyArray<(value: T) => void> = [];
  private _destroyListeners: ReadonlyArray<VoidFunction> = [];

  private constructor() {}

  /** Creates live stream. */
  static stream<T>(): Stream<T> {
    return new Stream<T>();
  }

  /** Sends _value_ to stream. */
  send(value: T): this {
    if (this._isActive) {
      this._valueListeners.forEach((fn) => fn(value as T));
    }

    return this;
  }

  map<R>(fn: (value: T) => R): Stream<R> {
    return this.derive((transformed) => (value) => transformed.send(fn(value)));
  }

  filter(predicate: (value: T) => boolean): Stream<T> {
    return this.derive((filtered) => (value) => {
      if (predicate(value)) {
        filtered.send(value);
      }
    });
  }

  /**
   * Creates new (**derived**) stream that depends on current stream.
   * Allow to create custom transform methods that maps over values
   * of current stream and sends it to derived stream.
   */
  derive<R>(fn: (derivedStream: Stream<R>) => (value: T) => void): Stream<R> {
    const derived = new Stream<R>();
    return derived.onDestroy(this.listen(fn(derived)));
  }

  /** Attach listener to be invoked in time of stream destroying. */
  onDestroy(fn: VoidFunction): this {
    if (this._isActive) {
      this._destroyListeners = [...this._destroyListeners, fn];
    }

    return this;
  }

  /**
   * Temporarily forbids stream to accept new values and listeners.
   * In contrary of `destroy` method, this method does not remove
   * old listeners.
   */
  freeze(): this {
    this._isActive = false;

    return this;
  }

  /**
   * Return to stream ability to accept listeners, values
   * and processing them.
   */
  resume(): this {
    this._isActive = true;

    return this;
  }

  /**
   * Destroys stream. Stream gets rid of all listeners and
   * will be uncapable to accept new values and listeners.
   *
   * Stream can be resumed by `resume` method, but listeners
   * need to be attached to stream again.
   */
  destroy(): this {
    this._isActive = false;
    this._destroyListeners.forEach((fn) => fn());
    this._destroyListeners = [];
    this._valueListeners = [];

    return this;
  }

  /**
   * Listen to every value that is passed through stream.
   *
   * @returns function that stops listener from observing stream.
   */
  listen(listener: (value: T) => void): VoidFunction {
    if (this._isActive) {
      this._valueListeners = [...this._valueListeners, listener];
      return () => {
        this._valueListeners = this._valueListeners.filter(
          (fn) => fn !== listener
        );
      };
    } else {
      return () => {};
    }
  }
}

export type { Stream };
export const { stream } = Stream;

/** Check if _value_ is instance of `Stream` monad. */
export const isStream = <T>(value: unknown): value is Stream<T> =>
  value instanceof Stream;
