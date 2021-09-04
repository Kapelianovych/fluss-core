import { isObject } from './is_object';
import { isPromise } from './is_promise';
import { isFunction } from './is_function';
import type { Monad, Typeable } from './types';

export type DoneFunction<T> = (value: T) => void;
export type FailFunction<E extends Error = Error> = (value: E) => void;

export type ForkFunction<T, E extends Error = Error> = (
  done: DoneFunction<T>,
  fail: FailFunction<E>,
) => void;

export const TASK_OBJECT_TYPE = '$Task';

/**
 * Monad that allow to perform some actions asynchronously and deferred
 * in time (in opposite `Promise` that start doing job immediately
 * after definition).
 */
export interface Task<T, E extends Error = Error> extends Typeable, Monad<T> {
  readonly start: ForkFunction<T, E>;
  readonly map: <R>(fn: (value: T) => R) => Task<R, E>;
  readonly chain: <R>(fn: (value: T) => Task<R, E>) => Task<R, E>;
  readonly apply: <R>(other: Task<(value: T) => R, E>) => Task<R, E>;
  readonly asPromise: () => Promise<T>;
}

export const task = <T, E extends Error = Error>(
  fork: ForkFunction<T, E> | Task<T, E> | Promise<T>,
): Task<T, E> => {
  const start = isTask(fork)
    ? fork.start
    : isPromise(fork)
    ? (done: DoneFunction<T>, fail: FailFunction<E>) => fork.then(done, fail)
    : fork;

  return {
    start,
    type: () => TASK_OBJECT_TYPE,
    map: (fn) =>
      task((done, fail) => start((value: T) => done(fn(value)), fail)),
    chain: (fn) =>
      task((done, fail) =>
        start((value: T) => fn(value).start(done, fail), fail),
      ),
    apply: (other) =>
      task((done, fail) => {
        start((value) => other.start((fn) => done(fn(value)), fail), fail);
      }),
    asPromise: () => new Promise(start),
  };
};

export const done = <T, E extends Error = Error>(value: T): Task<T, E> =>
  task((done, _) => done(value));

export const fail = <T, E extends Error = Error>(value: E): Task<T, E> =>
  task((_, fail) => fail(value));

/** Check if _value_ is instance of `Task` monad. */
export const isTask = <T, E extends Error = Error>(
  value: unknown,
): value is Task<T, E> =>
  isObject(value) &&
  isFunction((value as Typeable).type) &&
  (value as Typeable).type() === TASK_OBJECT_TYPE;
