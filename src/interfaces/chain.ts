import { Functor } from './functor';

export interface Chain extends Functor {
  /** Maps inner value and returns new monad instance with new value. */
  chain(fn: (value: any) => Chain): Chain;
}
