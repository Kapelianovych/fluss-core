import { isJust } from './is_just.js';
import { isObject } from './is_object.js';

export const OPTION_TYPE = '__$Option';

/** Represents an optional value. */
export type Option<T> = {
  readonly [OPTION_TYPE]: null;

  readonly map: <U>(callback: (value: T) => U) => Option<U>;
  readonly chain: <U>(callback: (value: T) => Option<U>) => Option<U>;
  readonly apply: <U>(other: Option<(value: T) => U>) => Option<U>;
  readonly isNone: () => boolean;
  readonly isSome: () => boolean;
  readonly toJSON: () => { readonly type: string; readonly value: T | null };
  readonly extract: (defaultValue: () => T) => T;
};

const _Option = <T>(value: T): Option<T> => ({
  [OPTION_TYPE]: null,

  map: (callback) => (isJust(value) ? Some(callback(value)) : None),
  chain: (callback) => (isJust(value) ? callback(value) : None),
  apply: (other) => (isJust(value) ? other.map((fn) => fn(value)) : None),
  isNone: () => !isJust(value),
  isSome: () => isJust(value),
  extract: (defaultValue) => value ?? defaultValue(),
  toJSON: () => ({ type: OPTION_TYPE, value: value ?? null }),
});

/** An empty *Option* value. */
export const None: Option<any> = _Option(null);

/** Crates an *Option* value with some type *T*. */
export const Some = _Option;

/** Check if a value is an instance of the `Option` monad. */
export const isOption = <T>(value: unknown): value is Option<T> =>
  isObject(value) && OPTION_TYPE in value;
