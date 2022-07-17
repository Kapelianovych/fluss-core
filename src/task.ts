import { isObject } from './is_object.js';
import { isPromise } from './is_promise.js';
import { Ok, Err, Result } from './result.js';

export type SucceedFunction<T> = (value: T) => void;
export type FailFunction<E> = (value: E) => void;

export type ForkFunction<T, E> = (
  succeed: SucceedFunction<T>,
  fail: FailFunction<E>,
) => void;

export const TASK_TYPE = '__$Task';

/**
 * Monad that allow to perform some actions asynchronously and deferred
 * in time (in opposite `Promise` that start doing job immediately
 * after definition).
 */
export type Task<T, E> = {
  readonly [TASK_TYPE]: null;

  readonly map: <R>(fn: (value: T) => R) => Task<R, E>;
  readonly run: () => Promise<Result<T, E>>;
  readonly chain: <R>(fn: (value: T) => Task<R, E>) => Task<R, E>;
  readonly apply: <R>(other: Task<(value: T) => R, E>) => Task<R, E>;
};

export const Task = <T, E>(
  fork: ForkFunction<T, E> | Task<T, E> | Promise<T>,
): Task<T, E> => {
  const start = isTask<T, E>(fork)
    ? (succeed: SucceedFunction<T>, fail: FailFunction<E>) =>
        fork.run().then((result) => result.map(succeed).mapError(fail))
    : isPromise(fork)
    ? (succeed: SucceedFunction<T>, fail: FailFunction<E>) =>
        fork.then(succeed, fail)
    : fork;

  return {
    [TASK_TYPE]: null,

    map: (fn) =>
      Task((succeed, fail) => start((value: T) => succeed(fn(value)), fail)),
    chain: (fn) =>
      Task((succeed, fail) =>
        start(
          (value: T) =>
            fn(value)
              .run()
              .then((result) => result.map(succeed).mapError(fail)),
          fail,
        ),
      ),
    apply: (other) =>
      Task((succeed, fail) =>
        other
          .run()
          .then((result) =>
            result
              .map((fn) => start((value) => succeed(fn(value)), fail))
              .mapError(fail),
          ),
      ),
    run: () =>
      new Promise((resolve) =>
        start(
          (value) => resolve(Ok(value)),
          (error) => resolve(Err(error)),
        ),
      ),
  };
};

export const Succeed = <T, E>(value: T): Task<T, E> =>
  Task((succeed, _) => succeed(value));

export const Fail = <T, E>(value: E): Task<T, E> =>
  Task((_, fail) => fail(value));

type MergedTaskResults<
  T extends readonly unknown[],
  R extends readonly unknown[] = [],
> = T extends readonly [Task<infer A, infer B>, ...infer Rest]
  ? MergedTaskResults<Rest, [...R, Result<A, B>]>
  : T extends readonly [Task<infer I, infer L>]
  ? [...R, Result<I, L>]
  : T extends readonly []
  ? R
  : never;

export const mergeTasks = <T extends readonly Task<unknown, unknown>[]>(
  ...tasks: T
): Task<MergedTaskResults<T>, never> =>
  Task((succeed, fail) =>
    tasks
      .reduce(
        (results, task) =>
          results.then((list) =>
            task.run().then((result) => (list.push(result), list)),
          ),
        Promise.resolve([] as Result<unknown, unknown>[]),
      )
      .then(succeed as any, fail as any),
  );

/** Checks if a _value_ is instance of the `Task` monad. */
export const isTask = <T, E>(value: unknown): value is Task<T, E> =>
  isObject(value) && TASK_TYPE in value;
