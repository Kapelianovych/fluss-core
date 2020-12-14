import type { Monad, Comonad } from './types';

/** Monad that contains value and allow perform operation on it by set of methods. */
class Wrapper<T> implements Comonad<T>, Monad<T> {
  // TODO: review this when ECMAScript's private class fields will be
  // widely spread in browsers.
  private readonly _value: T;

  private constructor(value: T) {
    this._value = value;
  }

  /**
   * Wraps value in `Wrapper` monad and allow perform on it operations in chainable way.
   * If value is `Wrapper`, then its copy will be returned.
   */
  static wrap<U>(value: U | Wrapper<U>): Wrapper<U> {
    return new Wrapper(isWrapper<U>(value) ? value.extract() : value);
  }

  map<R>(fn: (value: T) => R): Wrapper<R> {
    return Wrapper.wrap(fn(this._value));
  }

  apply<R>(other: Wrapper<(value: T) => R>): Wrapper<R> {
    return this.map(other.extract());
  }

  chain<R>(fn: (value: T) => Wrapper<R>): Wrapper<R> {
    return fn(this._value);
  }

  extract(): T {
    return this._value;
  }
}

export type { Wrapper };
export const { wrap } = Wrapper;

/** Check if value is instance of Wrapper. */
export function isWrapper<T>(value: any): value is Wrapper<T> {
  return value instanceof Wrapper;
}
