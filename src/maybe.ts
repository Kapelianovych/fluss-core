import { isNothing } from './is_nothing';
import type { Monad, Comonad } from './types';

/**
 * Monad that gets rid of `null` and `undefined`.
 * Its methods works only if inner value is not
 * _nothing_(`null` and `undefined`) and its state
 * is `Just`, otherwise they aren't invoked (except `extract`).
 * Wraps _nullable_ value and allow works with it without
 * checking on `null` and `undefined`.
 */
class Maybe<V> implements Comonad, Monad {
  // TODO: review this when ECMAScript's private class fields will be
  // widely spread in browsers.
  private readonly _value: V | null | undefined;

  private constructor(value: V | null | undefined) {
    this._value = value;
  }

  /** Wraps value with `Maybe` monad with **Just** state. */
  static just<T>(value: T): Maybe<T> {
    return new Maybe<T>(value);
  }

  /** Creates `Maybe` monad instance with **Nothing** state. */
  static nothing<T = null>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  /**
   * Wraps value with `Maybe` monad. Function detects state
   * (**Just** or **Nothing**) of `Maybe` by yourself.
   * If value is `Maybe`, then its copy will be returned.
   */
  static maybe<T>(value: T | Maybe<T> | null | undefined): Maybe<T> {
    const exposedValue = isMaybe<T>(value) ? value.extract() : value;
    return isNothing(exposedValue)
      ? Maybe.nothing<T>()
      : Maybe.just(exposedValue);
  }

  isJust(): this is Maybe<V> {
    return !this.isNothing();
  }

  isNothing(): this is Maybe<null | undefined> {
    return isNothing(this._value);
  }

  map<R>(fn: (value: NonNullable<V>) => R | null | undefined): Maybe<R> {
    return this.isJust()
      ? Maybe.maybe(fn(this._value as NonNullable<V>))
      : Maybe.nothing();
  }

  apply<R>(
    other: Maybe<(value: NonNullable<V>) => R | null | undefined>
  ): Maybe<R> {
    return other.isJust()
      ? this.map(other.extract() as (value: NonNullable<V>) => R)
      : Maybe.nothing();
  }

  chain<R>(fn: (value: NonNullable<V>) => Maybe<R>): Maybe<R> {
    return this.isJust() ? fn(this._value as NonNullable<V>) : Maybe.nothing();
  }

  extract(): V | null | undefined {
    return this._value;
  }
}

export type { Maybe };
export const { just, nothing, maybe } = Maybe;

/** Checks if value is instance of `Maybe` monad. */
export function isMaybe<T>(value: any): value is Maybe<T> {
  return value instanceof Maybe;
}
