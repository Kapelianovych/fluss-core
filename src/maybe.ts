import { Monad } from './interfaces/monad';
import { Comonad } from './interfaces/comonad';
import { isNothing } from './is_nothing';

const enum MaybeType {
  Just = 'Just',
  Nothing = 'Nothing',
}

class MaybeConstructor<V, T extends MaybeType = MaybeType>
  implements Comonad, Monad<V> {
  private constructor(
    private readonly value: T extends MaybeType.Just ? V : null | undefined,
    private readonly type: T
  ) {}

  static just<T>(value: T): MaybeConstructor<T, MaybeType.Just> {
    return new MaybeConstructor<T, MaybeType.Just>(value, MaybeType.Just);
  }

  static nothing<T>(): MaybeConstructor<T, MaybeType.Nothing> {
    return new MaybeConstructor<T, MaybeType.Nothing>(null, MaybeType.Nothing);
  }

  static maybeOf<T>(
    value: T
  ): T extends null
    ? MaybeConstructor<T, MaybeType.Nothing>
    : T extends undefined
    ? MaybeConstructor<T, MaybeType.Nothing>
    : MaybeConstructor<T, MaybeType.Just> {
    // @ts-ignore
    return isNothing(value)
      ? MaybeConstructor.nothing<T>()
      : MaybeConstructor.just(value);
  }

  isJust(): this is MaybeConstructor<V, MaybeType.Just> {
    return this.type === MaybeType.Just;
  }

  isNothing(): this is MaybeConstructor<V, MaybeType.Nothing> {
    return this.type === MaybeType.Nothing;
  }

  map<R>(fn: (value: V) => R): Maybe<R> {
    return this.isJust()
      ? MaybeConstructor.just(fn(this.value))
      : MaybeConstructor.nothing();
  }

  apply<R>(other: Maybe<(value: V) => R>): Maybe<R> {
    if (other.isNothing()) {
      return MaybeConstructor.nothing();
    }

    return this.map(other.extract());
  }

  chain<R>(fn: (value: V) => Maybe<R>): Maybe<R> {
    return this.isJust() ? fn(this.value) : MaybeConstructor.nothing();
  }

  extract(): T extends MaybeType.Just ? V : null | undefined {
    return this.value;
  }
}

export type Maybe<V> =
  | MaybeConstructor<V, MaybeType.Just>
  | MaybeConstructor<V, MaybeType.Nothing>;

export const { just, nothing, maybeOf } = MaybeConstructor;

export function isMaybe<T>(value: any): value is Maybe<T> {
  return value instanceof MaybeConstructor;
}
