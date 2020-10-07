import { Chain } from './chain';
import { Applicative } from './applicative';

export interface Monad extends Applicative, Chain {}
