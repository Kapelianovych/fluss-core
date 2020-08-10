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

  static just<T>(value: T): Maybe<T> {
    //@ts-ignore
    return new MaybeConstructor<T, MaybeType.Just>(value, MaybeType.Just);
  }

  static nothing<T>(): Maybe<T> {
    // @ts-ignore
    return new MaybeConstructor<T, MaybeType.Nothing>(null, MaybeType.Nothing);
  }

  static maybeOf<T>(value: T): Maybe<T> {
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

export type Maybe<V> = V extends null
  ? MaybeConstructor<V, MaybeType.Nothing>
  : V extends undefined
  ? MaybeConstructor<V, MaybeType.Nothing>
  : MaybeConstructor<V, MaybeType.Just>;

export const { just, nothing, maybeOf } = MaybeConstructor;

export function isMaybe<T>(value: any): value is Maybe<T> {
  return value instanceof MaybeConstructor;
}
