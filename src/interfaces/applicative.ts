import { Functor } from "./functor";

export interface Applicative<T> extends Functor<T> {
  apply<R>(other: Applicative<(value: T) => R>): Applicative<R>;
}