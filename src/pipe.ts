import { isPromise } from './is_promise';
import type {
  Tail,
  Last,
  First,
  Length,
  HasPromise,
  ReturnTypesOf,
} from './utilities';

type IsComposable<
  T extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>,
  R extends ReadonlyArray<(...args: ReadonlyArray<any>) => any> = [],
  U extends boolean = false
> = Length<T> extends 0
  ? U
  : IsComposable<
      Tail<T>,
      [First<T>, ...R],
      Length<R> extends 0
        ? false
        : ReturnType<First<R>> extends
            | First<Parameters<First<T>>>
            | Promise<First<Parameters<First<T>>>>
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
    ]
  >(
    ...fns: T
  ): IsComposable<T> extends false
    ? never
    : (
        ...args: Parameters<First<T>>
      ) => HasPromise<T> extends true
        ? ReturnType<Last<T>> extends Promise<infer U>
          ? Promise<U>
          : Promise<ReturnType<Last<T>>>
        : ReturnType<Last<T>> =>
  //@ts-ignore
  (...args) =>
    fns.reduce(
      (result, fn, index) =>
        index === 0
          ? (fn as T[0])(...result)
          : isPromise(result)
          ? result.then(fn)
          : fn(result),
      args
    );
