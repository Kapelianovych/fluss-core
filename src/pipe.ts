import { isPromise } from './is_promise';
import { NFn, NArray } from './utilities';

type IsComposable<
  T extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>,
  R extends ReadonlyArray<(...args: ReadonlyArray<any>) => any> = [],
  U extends boolean = false,
> = NArray.Length<T> extends 0
  ? U
  : IsComposable<
      NArray.Tail<T>,
      [NArray.First<T>, ...R],
      NArray.Length<R> extends 0
        ? false
        : ReturnType<NArray.First<R>> extends
            | NArray.First<Parameters<NArray.First<T>>>
            | Promise<NArray.First<Parameters<NArray.First<T>>>>
        ? true
        : false
    >;

/**
 * Performs left-to-right function composition.
 * Can handle asynchronous functions.
 */
export const pipe =
  <
    T extends readonly [
      (...args: ReadonlyArray<any>) => any,
      ...ReadonlyArray<(arg: any) => any>
    ],
  >(
    ...fns: T
  ): IsComposable<T> extends false
    ? never
    : (
        ...args: Parameters<NArray.First<T>>
      ) => NFn.IsAsyncIn<T> extends true
        ? ReturnType<NArray.Last<T>> extends Promise<infer U>
          ? Promise<U>
          : Promise<ReturnType<NArray.Last<T>>>
        : ReturnType<NArray.Last<T>> =>
  //@ts-ignore
  (...args) =>
    fns.reduce(
      (result, fn, index) =>
        index === 0
          ? (fn as T[0])(...result)
          : isPromise(result)
          ? result.then(fn)
          : fn(result),
      args,
    );
