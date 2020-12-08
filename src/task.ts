import { isPromise } from './is_promise';
import type { Chain } from './types';

export type DoneFunction<T> = (value: T) => void;
export type FailFunction<E extends Error> = (value: E) => void;

export type ForkFunction<T, E extends Error> = (
  done: DoneFunction<T>,
  fail: FailFunction<E>
) => void;

/**
 * Monad that allow to perform some actions asyncrounously and deferred
 * in time (in opposite `Promise` that start doing job immediately
 * after definition).
 */
class Task<T, E extends Error> implements Chain {
  private constructor(
    /** Starts `Task`. */ readonly start: ForkFunction<T, E>
  ) {}

  /** Defines `Task` or copies fork function from another `Task` or `Promise`. */
  static task<T, E extends Error>(
    fork: ForkFunction<T, E> | Task<T, E> | Promise<T>
  ): Task<T, E> {
    return new Task(
      isTask<T, E>(fork)
        ? fork.start
        : isPromise<T>(fork)
        ? (done, fail) => fork.then(done, fail)
        : fork
    );
  }

  /** Wraps value to process as `Task`. */
  static done<T, E extends Error>(value: T): Task<T, E> {
    return new Task((done) => done(value));
  }

  /** Create failed `Task`. */
  static fail<T, E extends Error>(value: E): Task<T, E> {
    return new Task((_, fail) => fail(value));
  }

  map<R>(fn: (value: T) => R): Task<R, E> {
    return Task.task((done, fail) => {
      this.start((value) => done(fn(value)), fail);
    });
  }

  chain<R>(fn: (value: T) => Task<R, E>): Task<R, E> {
    return Task.task((done, fail) => {
      this.start((value) => fn(value).start(done, fail), fail);
    });
  }

  /** Starts `Task` and return result in `Promise`. */
  asPromise(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.start(resolve, reject);
    });
  }
}

export type { Task };
export const { task, done, fail } = Task;

/** Check if _value_ is instance of `Task` monad. */
export function isTask<T, E extends Error>(value: any): value is Task<T, E> {
  return value instanceof Task;
}