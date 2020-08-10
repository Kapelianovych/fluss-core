import { Monad } from './interfaces/monad';
import { Comonad } from './interfaces/comonad';

const enum EitherType {
  Left = 'Left',
  Right = 'Right',
}

class EitherConstructor<L extends Error, R, T extends EitherType = EitherType>
  implements Comonad, Monad<R> {
  private constructor(
    private readonly value: T extends EitherType.Left ? L : R,
    private readonly type: T
  ) {}

  static left<L extends Error, R>(
    value: L
  ): EitherConstructor<L, R, EitherType.Left> {
    return new EitherConstructor<L, R, EitherType.Left>(value, EitherType.Left);
  }

  static right<L extends Error, R>(
    value: R
  ): EitherConstructor<L, R, EitherType.Right> {
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
    return this.type === EitherType.Right;
  }

  isLeft(): this is EitherConstructor<L, R, EitherType.Left> {
    return this.type === EitherType.Left;
  }

  map<A>(fn: (value: R) => A): Either<L, A> {
    return this.mapRight(fn);
  }

  mapRight<A>(fn: (value: R) => A): Either<L, A> {
    return this.isRight()
      ? EitherConstructor.right<L, A>(fn(this.value))
      : EitherConstructor.left<L, A>(this.value as L);
  }

  mapLeft<E extends Error>(fn: (value: L) => E): Either<E, R> {
    return this.isRight()
      ? EitherConstructor.right<E, R>(this.value)
      : EitherConstructor.left<E, R>(fn(this.value as L));
  }

  apply<U>(other: Either<L, (value: R) => U>): Either<L, U> {
    if (other.isLeft()) {
      return EitherConstructor.left(other.extract());
    }

    return this.mapRight(other.extract());
  }

  chain<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    return this.isRight()
      ? fn(this.value)
      : EitherConstructor.left<L, U>(this.value as L);
  }

  extract(): T extends EitherType.Left ? L : R {
    return this.value;
  }
}

export type Either<L extends Error, R> =
  | EitherConstructor<L, R, EitherType.Right>
  | EitherConstructor<L, R, EitherType.Left>;

export const { left, right, eitherOf } = EitherConstructor;

export function isEither<L extends Error, R>(
  value: any
): value is Either<L, R> {
  return value instanceof EitherConstructor;
}
