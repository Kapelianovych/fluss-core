import { Functor } from './functor';

export interface Applicative extends Functor {
  apply(other: Applicative): Applicative;
}
