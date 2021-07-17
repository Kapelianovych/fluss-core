import { concurrently } from './concurrently';
import { First, ReturnTypesOf, IsParametersEqual } from './utilities';

/**
 * Allow join output of functions that get
 * the same input and process it in a different way.
 */
export const fork =
  <F extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>>(...fns: F) =>
  <R>(join: (...args: ReturnTypesOf<F>) => R | Promise<R>) =>
  (...args: IsParametersEqual<F> extends true ? Parameters<First<F>> : never) =>
    concurrently(...fns)(...args).then((values) => join(...values));
