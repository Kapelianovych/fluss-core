import { Monad } from './interfaces/monad';
import { Comonad } from './interfaces/comonad';

class WrapperConstructor<T> implements Comonad, Monad<T> {
  private constructor(private readonly _value: T) {}

  static wrap<U>(value: U): Wrapper<U> {
    return new WrapperConstructor(value);
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

export type Wrapper<T> = WrapperConstructor<T>;

export const { wrap } = WrapperConstructor;

export function isWrapper<T>(value: any): value is Wrapper<T> {
  return value instanceof WrapperConstructor;
}
