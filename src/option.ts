import { isJust } from './is_just_nothing';
import { isObject } from './is_object';
import { isFunction } from './is_function';
import type { Just, Nothing } from './utilities';
import type { Typeable, Serializable } from './types';

export const OPTION_NONE_OBJECT_TYPE = '$None';
export const OPTION_SOME_OBJECT_TYPE = '$Some';

export interface Some<T> extends Typeable, Serializable<T> {
  map<R>(
    fn: (value: T) => R
  ): unknown extends R ? Option<R> : R extends Just<R> ? Some<R> : None;
  fill(): Some<T>;
  chain<R>(
    fn: (value: T) => Option<R>
  ): R extends Nothing ? None : unknown extends R ? None : Some<R>;
  apply<R>(
    other: Option<(value: T) => R>
  ): R extends Nothing ? None : unknown extends R ? None : Some<R>;
  isSome(): this is Some<T>;
  isNone(): this is None;
  extract(): T;
}

export interface None extends Typeable, Serializable<null> {
  map(): None;
  fill<T>(fn: () => T): Some<T>;
  chain(): None;
  apply(): None;
  isSome(): this is Some<never>;
  isNone(): this is None;
  extract(): null;
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
  value: T
): unknown extends T ? Option<T> : T extends Just<T> ? Some<T> : None =>
  // @ts-ignore
  isJust(value) ? some(value) : none;

/** Check if value is instance of `Option` monad. */
export const isOption = <T>(value: unknown): value is Option<T> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  ((value as Typeable).type() === OPTION_NONE_OBJECT_TYPE ||
    (value as Typeable).type() === OPTION_SOME_OBJECT_TYPE);
