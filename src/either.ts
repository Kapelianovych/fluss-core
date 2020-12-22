import { isError } from './is_error';
import type {
  Monad,
  Comonad,
  Serializable,
  SerializabledObject,
} from './types';

/**
 * Monad that can contain value or `Error`.
 * Allow handle errors in functional way.
 */
class Either<L extends Error, R>
  implements
    Monad<R>,
    Comonad<L | R>,
    Serializable<SerializabledObject<string> | R> {
  // TODO: review this when ECMAScript's private class fields will be
  // widely spread in browsers.
  private readonly _value: L | R;

  private constructor(value: L | R) {
    this._value = value;
  }

  /** Creates `Either` monad instance with **Left** state. */
  static left<L extends Error, R>(value: L): Either<L, R> {
    return new Either<L, R>(value);
  }

  /** Creates `Either` monad instance with **Right** state. */
  static right<L extends Error, R>(value: R): Either<L, R> {
    return new Either<L, R>(value);
  }

  /**
   * Wraps value with `Either` monad. Function detects state
   * (**Right** or **Left**) of `Either` by yourself.
   * If value is `Either`, then its copy will be returned.
   */
  static either<A extends Error, B>(value: A | B | Either<A, B>): Either<A, B> {
    return new Either<A, B>(isEither<A, B>(value) ? value.extract() : value);
  }

  isRight(): this is Either<never, R> {
    return !this.isLeft();
  }

  isLeft(): this is Either<L, never> {
    return isError<L>(this._value);
  }

  map<A>(fn: (value: R) => A): Either<L, A> {
    return this.mapRight(fn);
  }

  /** Maps inner value if it is not an `Error` instance. Same as `Either.map`. */
  mapRight<A>(fn: (value: R) => A): Either<L, A> {
    return new Either<L, A>(
      this.isRight() ? fn(this._value) : (this._value as L)
    );
  }

  /** Maps inner value if it is an `Error` instance */
  mapLeft<E extends Error>(fn: (value: L) => E | R): Either<E, R> {
    return new Either(this.isRight() ? this._value : fn(this._value as L));
  }

  apply<U>(other: Either<L, (value: R) => U>): Either<L, U> {
    return other.isRight()
      ? this.mapRight(other.extract())
      : new Either<L, U>(other.extract() as L);
  }

  chain<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    return this.isRight()
      ? fn(this._value)
      : new Either<L, U>(this._value as L);
  }

  toJSON(): SerializabledObject<SerializabledObject<string> | R> {
    return {
      type: 'Either',
      value: this.isLeft()
        ? {
            type: 'Error',
            value: this._value.message,
          }
        : (this._value as R),
    };
  }

  extract(): L | R {
    return this._value;
  }
}

export type { Either };
export const { left, right, either } = Either;

/** Checks if value is instance of `Either` monad. */
export function isEither<L extends Error, R>(
  value: any
): value is Either<L, R> {
  return value instanceof Either;
}
