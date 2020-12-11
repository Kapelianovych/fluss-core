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
  private readonly _value: V;

  private constructor(value: V) {
    this._value = value;
  }

  /** Creates `Maybe` monad instance with **Nothing** state. */
  static nothing<T = unknown>(): Maybe<T> {
    // @ts-ignore - container may have empty inner value, but
    // we suppose that container can contain value of type `T`.
    return new Maybe(null);
  }

  /** Creates `Maybe` monad instance with **Just** state. */
  static just<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  /**
   * Wraps value with `Maybe` monad.
   * If value is `Maybe`, then its copy will be returned.
   */
  static maybe<T>(value: T | Maybe<T>): Maybe<T> {
    return new Maybe(isMaybe<T>(value) ? value.extract() : value);
  }

  isJust(): this is Maybe<NonNullable<V>> {
    return !this.isNothing();
  }

  isNothing(): this is Maybe<null | undefined> {
    return isNothing(this._value);
  }

  map<R>(fn: (value: NonNullable<V>) => R): Maybe<R> {
    return this.isJust() ? new Maybe(fn(this._value)) : Maybe.nothing();
  }

  apply<R>(other: Maybe<(value: NonNullable<V>) => R>): Maybe<R> {
    return other.isJust() ? this.map(other.extract()) : Maybe.nothing();
  }

  chain<R>(fn: (value: NonNullable<V>) => Maybe<R>): Maybe<R> {
    return this.isJust() ? fn(this._value) : Maybe.nothing();
  }

  extract(): V {
    return this._value;
  }
}

export type { Maybe };
export const { just, maybe, nothing } = Maybe;

/** Checks if value is instance of `Maybe` monad. */
export function isMaybe<T>(value: any): value is Maybe<T> {
  return value instanceof Maybe;
}
