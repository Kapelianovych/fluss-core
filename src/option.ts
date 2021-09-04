import { isJust } from './is_just_nothing';
import { isObject } from './is_object';
import { isFunction } from './is_function';
import type { Just, Nothing } from './utilities';
import type { Typeable, Serializable, Monad, Comonad } from './types';

export const OPTION_NONE_OBJECT_TYPE = '$None';
export const OPTION_SOME_OBJECT_TYPE = '$Some';

export interface Some<T>
  extends Typeable,
    Monad<T>,
    Comonad<T>,
    Serializable<T> {
  readonly map: <R>(
    fn: (value: T) => R,
  ) => unknown extends R ? Option<R> : R extends Just<R> ? Some<R> : None;
  readonly fill: () => Some<T>;
  readonly chain: <R>(
    fn: (value: T) => Option<R>,
  ) => R extends Nothing ? None : unknown extends R ? None : Some<R>;
  readonly apply: <R>(
    other: Option<(value: T) => R>,
  ) => R extends Nothing ? None : unknown extends R ? None : Some<R>;
  readonly isSome: () => this is Some<T>;
  readonly isNone: () => this is None;
  readonly extract: () => T;
}

export interface None
  extends Typeable,
    Monad<null>,
    Comonad<null>,
    Serializable<null> {
  readonly map: () => None;
  readonly fill: <T>(fn: () => T) => Some<T>;
  readonly chain: () => None;
  readonly apply: () => None;
  readonly isSome: () => this is Some<never>;
  readonly isNone: () => this is None;
  readonly extract: () => null;
}

/** Monad that encapsulates value that can be undefined at some time. */
export type Option<T> = None | Some<T>;

export const none: None = {
  type: () => OPTION_NONE_OBJECT_TYPE,
  map: () => none,
  fill: (fn) => some(fn()),
  chain: () => none,
  apply: () => none,
  isNone: () => true,
  isSome: () => false,
  extract: () => null,
  toJSON: () => ({
    type: OPTION_NONE_OBJECT_TYPE,
    value: null,
  }),
};

export const some = <T>(value: T): Some<T> => ({
  map: (fn) => maybe(fn(value)),
  // @ts-ignore
  chain: (fn) => fn(value),
  // @ts-ignore
  apply: (other) => other.map((fn) => fn(value)),
  fill: () => some(value),
  isNone: () => false,
  isSome: () => true,
  extract: () => value,
  type: () => OPTION_SOME_OBJECT_TYPE,
  toJSON: () => ({
    type: OPTION_SOME_OBJECT_TYPE,
    value,
  }),
});

/**
 * Depending of the type of _value_ returns `None` or `Some`
 * monad.
 */
export const maybe = <T>(
  value: T,
): unknown extends T ? Option<T> : T extends Just<T> ? Some<T> : None =>
  // @ts-ignore
  isJust(value) ? some(value) : none;

/** Check if value is instance of `Option` monad. */
export const isOption = <T>(value: unknown): value is Option<T> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  ((value as Typeable).type() === OPTION_NONE_OBJECT_TYPE ||
    (value as Typeable).type() === OPTION_SOME_OBJECT_TYPE);
