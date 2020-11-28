import { Monad } from './interfaces/monad';
import { Comonad } from './interfaces/comonad';

class WrapperConstructor<T> implements Comonad, Monad {
  private constructor(private readonly _value: T) {}

  /**
   * Wraps value in `Wrapper` monad and allow perform on it operations in chainable way.
   * If value is `Wrapper`, then its copy will be returned.
   */
  static wrap<U>(value: U | Wrapper<U>): Wrapper<U> {
    const exposedValue = isWrapper<U>(value) ? value.extract() : value;
    return new WrapperConstructor(exposedValue);
  }

  map<R>(fn: (value: T) => R): Wrapper<R> {
    return WrapperConstructor.wrap(fn(this._value));
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

/** Monad that contains value and allow perform operation on it by set of methods. */
export type Wrapper<T> = WrapperConstructor<T>;

export const { wrap } = WrapperConstructor;

/** Check if value is instance of Wrapper. */
export function isWrapper<T>(value: any): value is Wrapper<T> {
  return value instanceof WrapperConstructor;
}
