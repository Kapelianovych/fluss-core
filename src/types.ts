export interface Functor {
  /** Maps inner value and returns new monad instance with new value. */
  map(fn: (value: any) => any): Functor;
}

export interface Applicative extends Functor {
  /**
   * Maps value by using value of `other` monad.
   * Value of other monad must be a **function type**.
   */
  apply(other: Applicative): Applicative;
}

export interface Chain extends Functor {
  /** Maps inner value and returns new monad instance with new value. */
  chain(fn: (value: any) => Chain): Chain;
}

export interface Comonad {
  /** Expose inner value to outside. */
  extract(): any;
}

export interface Monad extends Applicative, Chain {}
