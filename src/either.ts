import { Monad } from './interfaces/monad';
import { Comonad } from './interfaces/comonad';

const enum EitherType {
  Left = 'Left',
  Right = 'Right',
}

class EitherConstructor<L extends Error, R, T extends EitherType = EitherType>
  implements Comonad, Monad<R> {
  private constructor(
    private readonly _value: T extends EitherType.Left ? L : R,
    private readonly _type: T
  ) {}

  static left<L extends Error, R>(value: L): Either<L, R> {
    // @ts-ignore
    return new EitherConstructor<L, R, EitherType.Left>(value, EitherType.Left);
  }

  static right<L extends Error, R>(value: R): Either<L, R> {
    // @ts-ignore
    return new EitherConstructor<L, R, EitherType.Right>(
      value,
      EitherType.Right
    );
  }

  static eitherOf<A extends Error, B>(value: A | B): Either<A, B> {
    return value instanceof Error
      ? EitherConstructor.left<A, B>(value)
      : EitherConstructor.right<A, B>(value);
  }

  isRight(): this is EitherConstructor<L, R, EitherType.Right> {
    return this._type === EitherType.Right;
  }

  isLeft(): this is EitherConstructor<L, R, EitherType.Left> {
    return this._type === EitherType.Left;
  }

  map<A>(fn: (value: R) => L | A): Either<L, A> {
    return this.mapRight(fn);
  }

  mapRight<A>(fn: (value: R) => L | A): Either<L, A> {
    return this.isRight()
      ? EitherConstructor.eitherOf<L, A>(fn(this._value))
      : EitherConstructor.left<L, A>(this._value as L);
  }

  mapLeft<E extends Error>(fn: (value: L) => E | R): Either<E, R> {
    return this.isRight()
      ? EitherConstructor.right<E, R>(this._value)
      : EitherConstructor.eitherOf<E, R>(fn(this._value as L));
  }

  apply<U>(other: Either<L, (value: R) => L | U>): Either<L, U> {
    if (other.isLeft()) {
      return EitherConstructor.left(other.extract());
    }

    return this.mapRight(other.extract() as (value: R) => L | U);
  }

  chain<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    return this.isRight()
      ? fn(this._value)
      : EitherConstructor.left<L, U>(this._value as L);
  }

  extract(): T extends EitherType.Left ? L : R {
    return this._value;
  }
}

export type Either<L extends Error, R> = L | R extends Error
  ? EitherConstructor<L, R, EitherType.Left>
  : EitherConstructor<L, R, EitherType.Right>;

export const { left, right, eitherOf } = EitherConstructor;

export function isEither<L extends Error, R>(
  value: any
): value is Either<L, R> {
  return value instanceof EitherConstructor;
}
