import { List, list } from './list';
import { Maybe, maybe } from './maybe';
import { Either, either } from './either';
import type { SerializabledObject } from './types';

export type JSONValueTypes =
  | null
  | string
  | number
  | boolean
  | ReadonlyArray<unknown>
  | Record<string, unknown>;

/**
 * Add recognition of `Maybe`, `List`, `Either` and `Error`
 * data structures for `JSON.parse`.
 *
 * **Note**: constructing an `Error` is supported only from
 * `SerializabledObject<string>` structure.
 */
export const reviver = (
  key: string,
  value: JSONValueTypes | SerializabledObject<unknown>
):
  | JSONValueTypes
  | Error
  | List<unknown>
  | Maybe<unknown>
  | Either<Error, unknown> => {
  if (typeof value === 'object' && value !== null) {
    // Check for both properties to match SerializabledObject interface.
    if ('type' in value && 'value' in value) {
      switch (value['type']) {
        case 'List':
          return list(value['value']);
        case 'Maybe':
          return maybe(value['value']);
        case 'Either':
          return either(value['value']);
        // Handle Error object in Either.
        case 'Error':
          return new Error(value['value'] as string);
        default:
          return value as Record<string, unknown>;
      }
    } else {
      return value;
    }
  } else {
    return value;
  }
};
