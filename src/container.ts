import type { Monad, Comonad } from './types';

/** Monad that contains value and allow perform operation on it by set of methods. */
class Container<T> implements Comonad<T>, Monad<T> {
  // TODO: review this when ECMAScript's private class fields will be
  // widely spread in browsers.
  private constructor(private readonly _value: T) {}

  /**
   * Wraps value in `Container` monad and allow perform on it operations in chainable way.
   * If value is `Container`, then its copy will be returned.
   */
  static wrap<U>(value: U | Container<U>): Container<U> {
    return new Container<U>(isContainer<U>(value) ? value.extract() : value);
  }

  map<R>(fn: (value: T) => R): Container<R> {
    return new Container<R>(fn(this._value));
  }

  apply<R>(other: Container<(value: T) => R>): Container<R> {
    return this.map(other.extract());
  }

  chain<R>(fn: (value: T) => Container<R>): Container<R> {
    return fn(this._value);
  }

  extract(): T {
    return this._value;
  }
}

export type { Container };
export const { wrap } = Container;

/** Check if value is instance of Container. */
export const isContainer = <T>(value: unknown): value is Container<T> =>
  value instanceof Container;
