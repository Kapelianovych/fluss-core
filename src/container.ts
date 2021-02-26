import { isObject } from './is_object';
import { isFunction } from './is_function';
import type { Typeable, Serializable } from './types';

export const CONTAINER_OBJECT_TYPE = 'Container';

/** Monad that contains value and allow perform operation on it by set of methods. */
export interface Container<T> extends Typeable, Serializable<T> {
  map<R>(fn: (value: T) => R): Container<R>;
  chain<R>(fn: (value: T) => Container<R>): Container<R>;
  apply<R>(other: Container<(value: T) => R>): Container<R>;
  extract(): T;
}

/**
 * Wraps value in `Container` monad and allow
 * to perform on it operations in chainable way.
 */
export const wrap = <T>(value: T): Container<T> => ({
  type: () => CONTAINER_OBJECT_TYPE,
  extract: () => value,
  toJSON: () => ({
    type: CONTAINER_OBJECT_TYPE,
    value,
  }),
  map: (fn) => wrap(fn(value)),
  chain: (fn) => fn(value),
  apply: (other) => other.map((fn) => fn(value)),
});

/** Check if value is instance of `Container`. */
export const isContainer = <T>(value: unknown): value is Container<T> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  (value as Typeable).type() === CONTAINER_OBJECT_TYPE;
