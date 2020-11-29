import type { Monad, Comonad } from './types';

class EitherConstructor<L extends Error, R> implements Comonad, Monad {
  private constructor(private readonly _value: L | R) {}

  /** Creates `Either` monad instance with **Left** state. */
  static left<L extends Error, R>(value: L): Either<L, R> {
    return new EitherConstructor<L, R>(value);
  }

  /** Creates `Either` monad instance with **Right** state. */
  static right<L extends Error, R>(value: R): Either<L, R> {
    return new EitherConstructor<L, R>(value);
  }

  /**
   * Wraps value with `Either` monad. Function detects state
   * (**Right** or **Left**) of `Either` by yourself.
   * If value is `Either`, then its copy will be returned.
   */
  static eitherOf<A extends Error, B>(
    value: A | B | Either<A, B>
  ): Either<A, B> {
    const exposedValue = isEither<A, B>(value) ? value.extract() : value;
    return exposedValue instanceof Error
      ? EitherConstructor.left<A, B>(exposedValue)
      : EitherConstructor.right<A, B>(exposedValue);
  }

  isRight(): this is Either<never, R> {
    return !this.isLeft();
  }

  isLeft(): this is Either<L, never> {
    return this._value instanceof Error;
  }

  map<A>(fn: (value: R) => L | A): Either<L, A> {
    return this.mapRight(fn);
  }

  /** Maps inner value if it is not an `Error` instance. Same as `Either.map`. */
  mapRight<A>(fn: (value: R) => L | A): Either<L, A> {
    return this.isRight()
      ? EitherConstructor.eitherOf<L, A>(fn(this._value))
      : EitherConstructor.left<L, A>(this._value as L);
  }

  /** Maps inner value if it is an `Error` instance */
  mapLeft<E extends Error>(fn: (value: L) => E | R): Either<E, R> {
    return this.isRight()
      ? EitherConstructor.right<E, R>(this._value)
      : EitherConstructor.eitherOf<E, R>(fn(this._value as L));
  }

  apply<U>(other: Either<L, (value: R) => L | U>): Either<L, U> {
    return other.isRight()
      ? this.mapRight(other.extract())
      : EitherConstructor.left<L, U>(other.extract() as L);
  }

  chain<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    return this.isRight()
      ? fn(this._value)
      : EitherConstructor.left<L, U>(this._value as L);
  }

  extract(): L | R {
    return this._value;
  }
}

/**
 * Monad that can contain value or `Error`.
 * Allow handles errors in functional way.
 */
export type Either<L extends Error, R> = EitherConstructor<L, R>;

export const { left, right, eitherOf } = EitherConstructor;

/** Checks if value is instance of `Either` monad. */
export function isEither<L extends Error, R>(
  value: any
): value is Either<L, R> {
  return value instanceof EitherConstructor;
}
