import { isObject } from './is_object';
import { isFunction } from './is_function';
import type { Typeable, Serializable } from './types';

export const EITHER_LEFT_OBJECT_TYPE = 'Left';
export const EITHER_RIGHT_OBJECT_TYPE = 'Right';

export interface Right<B> extends Typeable, Serializable<B> {
  map<R>(fn: (value: B) => R): Right<R>;
  chain<R>(fn: (value: B) => Right<R>): Right<R>;
  apply<R>(other: Right<(value: B) => R>): Right<R>;
  handle(): Right<B>;
  isLeft(): this is Right<never>;
  isRight(): this is Right<B>;
  extract(): B;
}

export interface Left<A> extends Typeable, Serializable<A> {
  map(): Left<A>;
  chain(): Left<A>;
  apply(): Left<A>;
  isLeft(): this is Left<A>;
  isRight(): this is Left<never>;
  extract(): A;
  handle<B>(fn: (value: A) => B): Right<B>;
}

/**
 * Monad that can hold either success value: `Right` state
 * or error value: `Left` state.
 */
export type Either<A, B> = Left<A> | Right<B>;

export const right = <T>(value: T): Right<T> => ({
  map: (fn) => right(fn(value)),
  chain: (fn) => fn(value),
  apply: (other) => other.map((fn) => fn(value)),
  extract: () => value,
  isLeft: () => false,
  isRight: () => true,
  type: () => EITHER_RIGHT_OBJECT_TYPE,
  toJSON: () => ({
    type: EITHER_RIGHT_OBJECT_TYPE,
    value,
  }),
  handle: () => right(value),
});

export const left = <A>(value: A): Left<A> => ({
  extract: () => value,
  isLeft: () => true,
  isRight: () => false,
  handle: (fn) => right(fn(value)),
  type: () => EITHER_LEFT_OBJECT_TYPE,
  toJSON: () => ({
    type: EITHER_LEFT_OBJECT_TYPE,
    value,
  }),
  map: () => left(value),
  chain: () => left(value),
  apply: () => left(value),
});

/**
 * Lift _value_ into `Either` monad.
 * _isRight_ parameter helps find out if
 * _value_ must belong to `Right` or `Left` type.
 */
export const either = <A, B>(
  isRight: (value: A | B) => value is B,
  value: A | B
): Either<A, B> => (isRight(value) ? right(value) : left(value));

/** Checks if value is instance of `Either` monad. */
export const isEither = <A, B>(value: unknown): value is Either<A, B> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  ((value as Typeable).type() === EITHER_LEFT_OBJECT_TYPE ||
    (value as Typeable).type() === EITHER_RIGHT_OBJECT_TYPE);
