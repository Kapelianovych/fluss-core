import { Functor } from './functor';

export interface Chain extends Functor {
  chain(fn: (value: any) => Chain): Chain;
}
