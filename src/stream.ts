import type { Just } from './utilities';
import type { Filterable, Functor } from './types';

export interface StreamListener<T> {
  (value: T): void;
}

export enum StreamEvent {
  FREEZE = 'freeze',
  RESUME = 'resume',
  DESTROY = 'destroy',
}

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
  private _valueListeners: ReadonlyArray<StreamListener<T>> = [];
  private _freezeListeners: ReadonlyArray<VoidFunction> = [];
  private _resumeListeners: ReadonlyArray<VoidFunction> = [];
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
    return this.derive((mapped) => (value) => {
      mapped.send(fn(value));
    });
  }

  filter(predicate: (value: T) => boolean): Stream<T> {
    return this.derive((filtered) => (value) => {
      if (predicate(value)) {
        filtered.send(value);
      }
    });
  }

  join(...others: ReadonlyArray<Stream<T>>): Stream<T> {
    const joined = new Stream<T>();
    return joined.on(
      StreamEvent.DESTROY,
      ...[this, ...others].map((stream) =>
        stream.listen(joined.send.bind(joined))
      )
    );
  }

  uniqueBy<F>(fn: (value: T) => F): Stream<T> {
    const cache = new Set<F>();
    return this.derive((unique) => (value) => {
      const key = fn(value);
      if (!cache.has(key)) {
        cache.add(key);
        unique.send(value);
      }
    });
  }

  /** Get rid of `Nothing` values. */
  compress(): Stream<Just<T>> {
    return this.derive((compressed) => (value) => {
      if (value !== null && value !== undefined) {
        compressed.send(value as Just<T>);
      }
    });
  }

  /**
   * Creates new (**derived**) stream that depends on current stream.
   * Allow to create custom transform methods that maps over values
   * of current stream and sends it to derived stream.
   */
  derive<R>(fn: (derivedStream: Stream<R>) => StreamListener<T>): Stream<R> {
    const derived = new Stream<R>();
    return derived.on(StreamEvent.DESTROY, this.listen(fn(derived)));
  }

  on(event: StreamEvent, ...fns: ReadonlyArray<VoidFunction>): this {
    if (this._isActive) {
      switch (event) {
        case StreamEvent.FREEZE:
          this._freezeListeners = this._freezeListeners.concat(fns);
          break;
        case StreamEvent.RESUME:
          this._resumeListeners = this._resumeListeners.concat(fns);
          break;
        case StreamEvent.DESTROY:
          this._destroyListeners = this._destroyListeners.concat(fns);
          break;
        default:
        // Do nothing.
      }
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
    this._freezeListeners.forEach((fn) => fn());

    return this;
  }

  /**
   * Return to stream ability to accept listeners, values
   * and processing them.
   */
  resume(): this {
    this._isActive = true;
    this._resumeListeners.forEach((fn) => fn());

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

    this._valueListeners = [];
    this._freezeListeners = [];
    this._resumeListeners = [];
    this._destroyListeners = [];

    return this;
  }

  /**
   * Listen to every value that is passed through stream.
   *
   * @returns function that stops listener from observing stream.
   */
  listen(listener: StreamListener<T>): VoidFunction {
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
