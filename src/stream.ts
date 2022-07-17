import { identity } from './identity.js';
import { isObject } from './is_object.js';
import type { Tuple } from './utilities.js';

export const STREAM_TYPE = '__$Stream';

/** Structure that makes operations with values over time in live mode. */
export type Stream<I, O> = {
  readonly [STREAM_TYPE]: null;

  /** Sends a _value_ to the stream. */
  readonly send: (value: I) => void;
  /**
   * Listens to every value that is passed through the stream.
   *
   * @returns function that stops listener from observing the stream.
   */
  readonly forEach: <U>(
    listener: Stream<O, U> | ((value: O) => void),
  ) => VoidFunction;
};

export const Stream = <Fns extends readonly ((args: any) => unknown)[]>(
  ...fns: Fns
): Stream<
  Tuple.First<Parameters<Tuple.First<Fns>>>,
  ReturnType<Tuple.Last<Fns>>
> => {
  const transform = fns.reduce(
    (first, second) => (arg: unknown) => {
      if (arg === undefined) {
        return;
      }

      const result = first(arg);

      if (result === undefined) {
        return;
      }

      return second(result);
    },
    identity,
  );

  const listeners = new Set<
    | Stream<ReturnType<Tuple.Last<Fns>>, unknown>
    | ((value: ReturnType<Tuple.Last<Fns>>) => void)
  >();

  return {
    [STREAM_TYPE]: null,

    send: (value) =>
      listeners.forEach((fn) => {
        const result = transform(value);

        if (result !== undefined) {
          isStream(fn) ? fn.send(result) : (fn as Function)(result);
        }
      }),
    forEach: (fn) => {
      listeners.add(fn);
      return (): void => void listeners.delete(fn);
    },
  };
};

/** Check if _value_ is instance of the `Stream` monad. */
export const isStream = <I, O>(value: unknown): value is Stream<I, O> =>
  isObject(value) && STREAM_TYPE in value;
