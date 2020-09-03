import { Chain } from './chain';
import { Applicative } from './applicative';

export interface Monad<T> extends Applicative<T>, Chain<T> {}
