import { Functor } from "./functor";

export interface Chain<T> extends Functor<T> {
  chain<R>(fn: (value: T) => Chain<R>): Chain<R>;
}