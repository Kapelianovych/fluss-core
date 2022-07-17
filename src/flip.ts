import type { Tuple } from './utilities.js';

/** Reverses function's parameters. */
export const flip =
  <F extends (...args: readonly any[]) => any>(fn: F) =>
  (...args: Tuple.Reverse<Parameters<F>>): ReturnType<F> =>
    fn(...(args as any[]).reverse());
