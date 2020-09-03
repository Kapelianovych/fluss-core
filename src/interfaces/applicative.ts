import { Functor } from './functor';

export interface Applicative<T> extends Functor<T> {
  apply(other: Applicative<(value: T) => any>): Applicative<any>;
}
