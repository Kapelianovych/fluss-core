import { array } from './array';
import { isPromise } from './is_promise';
import { NArray, NFn } from './utilities';

/** Executes functions simultaneously and can return arrays of execution results. */
export const concurrently =
  <F extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>>(...fns: F) =>
  async (
    ...args: NArray.Flatten<NArray.TrimLastEmpty<NFn.ParametersOf<F>>>
  ): Promise<NFn.ReturnTypesOf<F>> =>
    Promise.all(
      fns.map(
        (fn, index) =>
          new Promise((resolve, reject) => {
            const parameters = array((args as any[])[index]);

            try {
              const result = fn(...parameters);
              isPromise(result)
                ? result.then(resolve, reject)
                : resolve(result);
            } catch (error) {
              reject(error);
            }
          }),
      ),
    ) as NFn.ReturnTypesOf<F>;
