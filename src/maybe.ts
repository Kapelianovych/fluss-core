import { Monad } from './interfaces/monad';
import { Comonad } from './interfaces/comonad';
import { isNothing } from './is_nothing';

class MaybeConstructor<V> implements Comonad, Monad {
  private constructor(private readonly _value: V | null | undefined) {}

  static just<T>(value: T): Maybe<T> {
    return new MaybeConstructor<T>(value);
  }

  static nothing<T = null>(): Maybe<T> {
    return new MaybeConstructor<T>(null);
  }

  static maybeOf<T>(value: T | Maybe<T> | null | undefined): Maybe<T> {
    const exposedValue = isMaybe<T>(value) ? value.extract() : value;
    return isNothing(exposedValue)
      ? MaybeConstructor.nothing<T>()
      : MaybeConstructor.just(exposedValue);
  }

  isJust(): this is Maybe<V> {
    return !this.isNothing();
  }

  isNothing(): this is Maybe<null | undefined> {
    return isNothing(this._value);
  }

  map<R>(fn: (value: NonNullable<V>) => R | null | undefined): Maybe<R> {
    return this.isJust()
      ? MaybeConstructor.maybeOf(fn(this._value as NonNullable<V>))
      : MaybeConstructor.nothing();
  }

  apply<R>(
    other: Maybe<(value: NonNullable<V>) => R | null | undefined>
  ): Maybe<R> {
    return other.isJust()
      ? this.map(other.extract() as (value: NonNullable<V>) => R)
      : MaybeConstructor.nothing();
  }

  chain<R>(fn: (value: NonNullable<V>) => Maybe<R>): Maybe<R> {
    return this.isJust()
      ? fn(this._value as NonNullable<V>)
      : MaybeConstructor.nothing();
  }

  extract(): V | null | undefined {
    return this._value;
  }
}

export const { just, nothing, maybeOf } = MaybeConstructor;

export type Maybe<V> = MaybeConstructor<V>;

export function isMaybe<T>(value: any): value is Maybe<T> {
  return value instanceof MaybeConstructor;
}
