import { isPromise } from './is_promise';
import { First, ReturnTypesOf, IsParametersEqual } from './utilities';

/** Executes functions simultaneously and can return arrays of execution results. */
export const concurrently =
  <F extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>>(...fns: F) =>
  async (
    ...args: IsParametersEqual<F> extends true ? Parameters<First<F>> : never
  ): Promise<ReturnTypesOf<F>> =>
    Promise.all(
      fns.map(
        (fn) =>
          new Promise((resolve, reject) => {
            try {
              const result = fn(...(args as any));
              isPromise(result)
                ? result.then(resolve, reject)
                : resolve(result);
            } catch (error) {
              reject(error);
            }
          })
      )
    ) as ReturnTypesOf<F>;
