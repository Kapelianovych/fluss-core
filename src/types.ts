export interface Functor<T> {
  /** Maps inner value and returns new monad instance with new value. */
  map<R>(fn: (value: T) => R): Functor<R>;
}

export interface Applicative<T> extends Functor<T> {
  /**
   * Maps value by using value of `other` monad.
   * Value of other monad must be a **function type**.
   */
  apply<R>(other: Applicative<(value: any) => R>): Applicative<R>;
}

export interface Chain<T> extends Functor<T> {
  /** Maps inner value and returns new monad instance with new value. */
  chain<R>(fn: (value: T) => Chain<R>): Chain<R>;
}

export interface Comonad<T> {
  /** Expose inner value to outside. */
  extract(): T;
}

export interface Monad<T> extends Applicative<T>, Chain<T> {}

export interface Foldable<T> {
  /** Reduce iterable to some value. */
  fold<R>(fn: (accumulator: R, value: T) => R, accumulator: R): R;
}

export interface Filterable<T> {
  /** Filter data based on _predicat_ function. */
  filter(predicat: (value: T) => boolean): Filterable<T>;
}
