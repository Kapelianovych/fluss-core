import { isObject } from './is_object';
import { isFunction } from './is_function';
import type { Typeable } from './types';

export const LAZY_OBJECT_TYPE = '$Lazy';

/**
 * Monad that constructs and compose operations over value.
 * Similar to `pipe` function, but allows more comprehensive
 * transformation of intermediate values.
 */
export interface Lazy<F, L> extends Typeable {
  /** Perform operation over _value_. */
  run: (value: F) => L;
  map<R>(fn: (value: L) => R): Lazy<F, R>;
  chain<R>(fn: (value: L) => Lazy<F, R>): Lazy<F, R>;
  apply<R>(other: Lazy<F, (value: L) => R>): Lazy<F, R>;
  compose<I>(other: Lazy<L, I>): Lazy<F, I>;
}

export const lazy = <F, L>(run: (value: F) => L): Lazy<F, L> => ({
  run,
  map: (fn) => lazy((value) => fn(run(value))),
  type: () => LAZY_OBJECT_TYPE,
  chain: (fn) => lazy((value) => fn(run(value)).run(value)),
  apply: (other) =>
    lazy((value) => other.map((fn) => fn(run(value))).run(value)),
  compose: (other) => lazy((value) => other.run(run(value))),
});

/** Check if value is `Lazy` instance. */
export const isLazy = <F, L>(value: unknown): value is Lazy<F, L> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  (value as Typeable).type() === LAZY_OBJECT_TYPE;
