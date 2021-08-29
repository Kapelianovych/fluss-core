import { isPromise } from './is_promise';
import { NFn, NArray } from './utilities';

export interface ForkJoinFunction {
  <F extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>>(...fns: F): <
    R,
  >(
    join: (...args: NFn.ReturnTypesOf<F>) => R,
  ) => (
    ...args: NFn.IsParametersEqual<F> extends true
      ? Parameters<NArray.First<F>>
      : never
  ) => NFn.IsAsyncIn<F> extends true
    ? R extends Promise<unknown>
      ? R
      : Promise<R>
    : R;
}

/**
 * Allow join output of functions that get
 * the same input and process it in a different way.
 */
export const fork: ForkJoinFunction =
  (...fns) =>
  (join) =>
  // @ts-ignore
  // TypeScript complains on conditional type :(
  (...args) => {
    const results = fns.map((fn) => fn(...args));
    return results.some(isPromise)
      ? Promise.all(results).then((values) => join(...(values as any)))
      : join(...(results as any));
  };
