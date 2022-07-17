import { isJust } from './is_just.js';
import { None, Option, Some } from './option.js';

export interface ConditionalFunction<A extends readonly any[]> {
  <R>(onTrue: (...values: A) => R): (...values: A) => Option<R>;
  <R>(onTrue: (...values: A) => R, onFalse: (...values: A) => R): (
    ...values: A
  ) => R;
}

export const when = <A extends readonly any[]>(
  condition: (...values: A) => boolean,
): ConditionalFunction<A> =>
  ((onTrue, onFalse) =>
    (...values) => {
      const result = condition(...values)
        ? onTrue(...values)
        : onFalse?.(...values);
      return isJust(onFalse) ? result : isJust(result) ? Some(result) : None;
    }) as ConditionalFunction<A>;
