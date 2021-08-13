import { isNothing } from './is_just_nothing';
import { maybe, Option } from './option';

export interface ConditionalFunction<A extends ReadonlyArray<any>, R> {
  (onTrue: (...values: A) => R): (...values: A) => Option<R>;
  (onTrue: (...values: A) => R, onFalse: (...values: A) => R): (
    ...values: A
  ) => R;
}

export const when = <A extends ReadonlyArray<any>, R>(
  condition: (...values: A) => boolean,
): ConditionalFunction<A, R> =>
  ((onTrue, onFalse) =>
    (...values) => {
      const result = condition(...values)
        ? onTrue(...values)
        : onFalse?.(...values);
      return isNothing(onFalse) ? maybe(result) : result;
    }) as ConditionalFunction<A, R>;
