import { Cast } from './utilities';

type FunctionKeys<T extends object> = {
  [K in keyof T as T[K] extends (...args: ReadonlyArray<any>) => any
    ? K
    : never]: T[K];
};

/** Extracts method from object. */
export const demethodize =
  <T extends object, K extends keyof FunctionKeys<T>>(target: T, name: K) =>
  (...args: Parameters<T[Cast<K, keyof T>]>): ReturnType<T[Cast<K, keyof T>]> =>
    // @ts-ignore
    target[name](...args);
