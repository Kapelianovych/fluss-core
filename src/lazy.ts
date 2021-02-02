import type { Monad } from './types';

/** Transformation function from `A` to `B`. */
export interface Operation<A, B> {
  (value: A): B;
}

/**
 * Monad that constructs and compose operations over value.
 * Similar to `pipe` function, but allows more comprehensive
 * transformation of intermediate values.
 */
class Lazy<F, L> implements Monad<L> {
  private constructor(
    /** Perform operation over _value_. */ readonly result: Operation<F, L>
  ) {}

  /** Defines lazy operation. */
  static lazy<F, L>(value: Operation<F, L> | Lazy<F, L>): Lazy<F, L> {
    return new Lazy<F, L>(isLazy<F, L>(value) ? value.result : value);
  }

  apply<R>(other: Lazy<F, Operation<L, R>>): Lazy<F, R> {
    return new Lazy<F, R>((value) => other.result(value)(this.result(value)));
  }

  map<R>(fn: (value: L) => R): Lazy<F, R> {
    return new Lazy<F, R>((value) => fn(this.result(value)));
  }

  chain<R>(fn: (value: L) => Lazy<F, R>): Lazy<F, R> {
    return new Lazy<F, R>((value) => fn(this.result(value)).result(value));
  }
}

export type { Lazy };
export const { lazy } = Lazy;

/** Check if value is `Lazy` instance. */
export function isLazy<F, L>(value: unknown): value is Lazy<F, L> {
  return value instanceof Lazy;
}
