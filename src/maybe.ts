import { isNothing } from './is_nothing';
import type { HasNothing, Just, Nothing } from './utilities';
import type {
  Monad,
  Comonad,
  Serializable,
  SerializabledObject,
} from './types';

/**
 * Monad that gets rid of `null` and `undefined`.
 * Its methods works only if inner value is not
 * _nothing_(`null` and `undefined`) and its state
 * is `Just`, otherwise they aren't invoked (except `extract`).
 * Wraps _nullable_ value and allow works with it without
 * checking on `null` and `undefined`.
 */
class Maybe<V> implements Comonad<V>, Monad<V>, Serializable<V> {
  // TODO: review this when ECMAScript's private class fields will be
  // widely spread in browsers.
  private readonly _value: V;

  private constructor(value: V) {
    // @ts-ignore - we need it to discard
    // _undefined_ to make inner value serializable.
    this._value = value ?? null;
  }

  /** Creates `Maybe` monad instance with **Nothing** state. */
  static nothing<T = null>(): Maybe<T | null> {
    return new Maybe<T | null>(null);
  }

  /** Creates `Maybe` monad instance with **Just** state. */
  static just<T>(value: Just<T>): Maybe<T> {
    return new Maybe<T>(value);
  }

  /**
   * Wraps value with `Maybe` monad.
   * If value is `Maybe`, then its copy will be returned.
   */
  static maybe<T>(
    value: T | Maybe<T>
  ): HasNothing<T> extends true ? Maybe<Just<T> | null> : Maybe<T> {
    // @ts-ignore
    return new Maybe(isMaybe<T>(value) ? value.extract() : value);
  }

  isJust(): this is Maybe<Just<V>> {
    return !this.isNothing();
  }

  isNothing(): this is Maybe<Nothing> {
    return isNothing(this._value);
  }

  map<R>(
    fn: (value: Just<V>) => R
  ): HasNothing<V> extends true ? Maybe<Just<R> | null> : Maybe<R> {
    // @ts-ignore
    return this.isJust() ? new Maybe(fn(this._value)) : Maybe.nothing();
  }

  apply<R>(
    other: Maybe<(value: Just<V>) => R>
  ): HasNothing<V> extends true ? Maybe<Just<R> | null> : Maybe<R> {
    // @ts-ignore
    return other.isJust() ? this.map(other.extract()) : Maybe.nothing();
  }

  chain<R>(
    fn: (value: Just<V>) => Maybe<R>
  ): HasNothing<V> extends true ? Maybe<Just<R> | null> : Maybe<R> {
    // @ts-ignore
    return this.isJust() ? fn(this._value) : Maybe.nothing();
  }

  /** Provide default value if `Maybe` has _Nothing_ state. */
  fill(fn: () => Just<V>): Maybe<Just<V>> {
    return new Maybe<Just<V>>(
      this.isNothing() ? fn() : (this._value as Just<V>)
    );
  }

  toJSON(): SerializabledObject<V> {
    return {
      type: 'Maybe',
      value: this._value,
    };
  }

  extract(): V {
    return this._value;
  }
}

export type { Maybe };
export const { just, maybe, nothing } = Maybe;

/** Checks if value is instance of `Maybe` monad. */
export const isMaybe = <T>(value: unknown): value is Maybe<T> =>
  value instanceof Maybe;
