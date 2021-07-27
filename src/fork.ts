import { NFn, NArray } from './utilities';
import { concurrently } from './concurrently';

/**
 * Allow join output of functions that get
 * the same input and process it in a different way.
 */
export const fork =
  <F extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>>(...fns: F) =>
  <R>(join: (...args: NFn.ReturnTypesOf<F>) => R | Promise<R>) =>
  (
    ...args: NFn.IsParametersEqual<F> extends true
      ? Parameters<NArray.First<F>>
      : never
  ) =>
    concurrently(...fns)(...(fns.map(() => args) as any)).then((values) =>
      join(...values)
    );
