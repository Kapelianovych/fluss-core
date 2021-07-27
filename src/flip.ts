import { NArray } from './utilities';

/** Reverses function's parameters. */
export const flip =
  <F extends (...args: ReadonlyArray<any>) => any>(fn: F) =>
  (...args: NArray.Reverse<Parameters<F>>): ReturnType<F> =>
    fn(...(args as any[]).reverse());
