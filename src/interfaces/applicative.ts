import { Functor } from './functor';

export interface Applicative extends Functor {
  /**
   * Maps value by using value of `other` monad.
   * Value of other monad must be a **function type**.
   */
  apply(other: Applicative): Applicative;
}
