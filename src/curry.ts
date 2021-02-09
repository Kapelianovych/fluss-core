import type { Rest } from './utilities';

type Curried<P extends ReadonlyArray<unknown>, R> = <U extends Partial<P>>(
  ...args: U
) => Rest<P, U> extends [] ? R : Curried<Rest<P, U>, R>;

/**
 * Create curried version of function with
 * optional partial application.
 */
export const curry = <P extends ReadonlyArray<unknown>, R>(
  fn: (...args: P) => R
): Curried<P, R> => {
  return <U extends Partial<P>>(
    ...args: U
  ): Rest<P, U> extends [] ? R : Curried<Rest<P, U>, R> => {
    // @ts-ignore
    return args.length >= fn.length
      ? fn(...((args as unknown) as P))
      : // @ts-ignore
        curry<Rest<P, U>, R>((...rest) => fn(...args, ...rest));
  };
};
