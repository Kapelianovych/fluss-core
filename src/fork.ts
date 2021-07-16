import { First, IsParametersEqual, ReturnTypesOf } from './utilities';

/**
 * Allow join output of functions that get
 * the same input and process it in a different way.
 */
export const fork =
  <F extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>, R>(
    join: (
      ...args: IsParametersEqual<F> extends true ? ReturnTypesOf<F> : never
    ) => R,
    ...fns: F
  ): ((
    ...args: IsParametersEqual<F> extends true ? Parameters<First<F>> : never
  ) => R) =>
  (...args) =>
    // @ts-ignore
    join(...fns.map((fn) => fn(...args)));
