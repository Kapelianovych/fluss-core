import { array } from './array';
import { isPromise } from './is_promise';
import { If, NArray, NFn } from './utilities';

type ConcurrentlyParameters<V extends ReadonlyArray<any>> = NArray.Flatten<
  NArray.TrimLastEmpty<NFn.ParametersOf<V>>
>;

/** Executes functions simultaneously and can return arrays of execution results. */
export const concurrently =
  <F extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>>(...fns: F) =>
  async (
    ...args: If<
      NArray.IsSameInnerType<ConcurrentlyParameters<F>>,
      ConcurrentlyParameters<F> | [NArray.First<ConcurrentlyParameters<F>>],
      ConcurrentlyParameters<F>
    >
  ): Promise<NFn.ReturnTypesOf<F>> => {
    const parameters =
      (args as any[]).length === 0
        ? fns.map(() => [])
        : (args as any[]).length === 1
        ? fns.map(() => array((args as any[])[0]))
        : (args as any[]).map((value) => array(value));

    return Promise.all(
      fns.map(
        (fn, index) =>
          new Promise((resolve, reject) => {
            try {
              const result = fn(...parameters[index]);
              isPromise(result)
                ? result.then(resolve, reject)
                : resolve(result);
            } catch (error) {
              reject(error);
            }
          }),
      ),
    ) as NFn.ReturnTypesOf<F>;
  };
