import { Reverse } from './utilities';

/** Reverses function's parameters. */
export const flip =
  <F extends (...args: ReadonlyArray<any>) => any>(fn: F) =>
  (...args: Reverse<Parameters<F>>): ReturnType<F> =>
    fn(...(args as any[]).reverse());
