import { isObject } from './is_object';
import { List, list, LIST_OBJECT_TYPE } from './list';
import { Idle, idle, IDLE_OBJECT_TYPE } from './idle';
import { Tuple, tuple, TUPLE_OBJECT_TYPE } from './tuple';
import { Container, CONTAINER_OBJECT_TYPE, wrap } from './container';
import {
  some,
  none,
  Option,
  OPTION_NONE_OBJECT_TYPE,
  OPTION_SOME_OBJECT_TYPE,
} from './option';
import {
  left,
  right,
  Either,
  EITHER_LEFT_OBJECT_TYPE,
  EITHER_RIGHT_OBJECT_TYPE,
} from './either';
import type { SerializabledObject } from './types';

export type JSONValueTypes =
  | null
  | string
  | number
  | boolean
  | ReadonlyArray<unknown>
  | Record<string, unknown>;

/**
 * Add recognition of `Container`, `Maybe`, `List`, `Tuple`,
 * `Idle` `Either` and `Error` data structures for `JSON.parse`.
 *
 * **Note**: constructing an `Error` is supported only from
 * `SerializabledObject<string>` structure.
 */
export const reviver = (
  key: string,
  value: JSONValueTypes | SerializabledObject<unknown>
):
  | JSONValueTypes
  | Idle<unknown>
  | List<unknown>
  | Option<unknown>
  | Container<unknown>
  | Either<unknown, unknown>
  | Tuple<ReadonlyArray<unknown>> => {
  if (isObject(value)) {
    // Check for both properties to match SerializabledObject interface.
    if ('type' in value && 'value' in value) {
      switch (value['type']) {
        case LIST_OBJECT_TYPE:
          return list(value['value']);
        case TUPLE_OBJECT_TYPE:
          return tuple(...(value['value'] as ReadonlyArray<unknown>));
        case IDLE_OBJECT_TYPE:
          return idle(() => value['value']);
        case OPTION_SOME_OBJECT_TYPE:
          return some(value['value']);
        case OPTION_NONE_OBJECT_TYPE:
          return none;
        case CONTAINER_OBJECT_TYPE:
          return wrap(value['value']);
        case EITHER_LEFT_OBJECT_TYPE:
          return left(value['value']);
        case EITHER_RIGHT_OBJECT_TYPE:
          return right(value['value']);
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
