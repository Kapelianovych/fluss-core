import { isObject } from './is_object.js';
import type { Cast, Tuple } from './utilities.js';

export const RESULT_TYPE = '__$Result';

export enum ResultState {
  Ok = '__$Ok',
  Err = '__$Error',
}

/** A type that represents either a success value or a failure. */
export type Result<Y, N> = {
  readonly [RESULT_TYPE]: null;

  readonly map: <U>(callback: (value: Y) => U) => Result<U, N>;
  readonly isOk: () => boolean;
  readonly chain: <U>(callback: (value: Y) => Result<U, N>) => Result<U, N>;
  readonly apply: <U>(other: Result<(value: Y) => U, N>) => Result<U, N>;
  readonly toJSON: () => {
    readonly type: string;
    readonly value: { readonly kind: ResultState; readonly value: Y | N };
  };
  readonly extract: {
    (): Y | N;
    (defaultValue: (error: N) => Y): Y;
  };
  readonly isErr: () => boolean;
  readonly mapError: <E>(callback: (value: N) => E) => Result<Y, E>;
};

const _Result = <O, E, Kind extends ResultState>(
  kind: Kind,
  value: Kind extends ResultState.Ok ? O : E,
): Result<O, E> => ({
  [RESULT_TYPE]: null,

  map: (callback) =>
    kind === ResultState.Ok ? Ok(callback(value as O)) : Err(value as E),
  isOk: () => kind === ResultState.Ok,
  chain: (callback) =>
    kind === ResultState.Ok ? callback(value as O) : Err(value as E),
  apply: (other) =>
    kind === ResultState.Ok
      ? other.map((fn) => fn(value as O))
      : Err(value as E),
  isErr: () => kind === ResultState.Err,
  extract: ((defaultValue) =>
    kind === ResultState.Ok
      ? (value as O)
      : defaultValue !== undefined
      ? defaultValue(value as E)
      : value) as Result<O, E>['extract'],
  mapError: (callback) =>
    kind === ResultState.Ok ? Ok(value as O) : Err(callback(value as E)),
  toJSON: () => ({
    type: RESULT_TYPE,
    value: { kind, value },
  }),
});

/** Creates a *Result* that contains a success value. */
export const Ok = <T, E = never>(value: T): Result<T, E> =>
  _Result<T, E, ResultState.Ok>(ResultState.Ok, value);

/** Creates a *Result* that contains a failure value. */
export const Err = <T, R = never>(value: T): Result<R, T> =>
  _Result<R, T, ResultState.Err>(ResultState.Err, value);

/**
 * Returns the *Ok* value if the *fn* runs successfully.
 * Otherwise, it returns the *Error* value.
 */
export const tryExecute = <T, E>(fn: () => T): Result<T, E> => {
  try {
    return Ok(fn());
  } catch (error) {
    return Err(error as E);
  }
};

type MergedResults<
  T extends readonly Result<unknown, unknown>[],
  S extends readonly unknown[] = [],
  E = never,
> = Tuple.Length<T> extends 0
  ? [S, E]
  : MergedResults<
      Cast<Tuple.Shift<T>, readonly Result<unknown, unknown>[]>,
      [...S, Tuple.First<T> extends Result<infer A, unknown> ? A : never],
      E | Tuple.First<T> extends Result<unknown, infer B> ? B : never
    >;

export const mergeResults = <T extends readonly Result<any, any>[]>(
  ...results: T
): Result<Tuple.First<MergedResults<T>>, Tuple.Last<MergedResults<T>>> =>
  results.reduce(
    (accumulator, result) =>
      accumulator.chain(
        (list) =>
          result.map((value) => ((list as any[]).push(value), list)) as Result<
            Tuple.First<MergedResults<T>>,
            Tuple.Last<MergedResults<T>>
          >,
      ),
    Ok<Tuple.First<MergedResults<T>>, Tuple.Last<MergedResults<T>>>(
      [] as Tuple.First<MergedResults<T>>,
    ),
  );

export const isResult = <T, E>(value: unknown): value is Result<T, E> =>
  isObject(value) && RESULT_TYPE in value;
