import { isObject } from './is_object';
import { List, list, LIST_OBJECT_TYPE } from './list';
import { Idle, idle, IDLE_OBJECT_TYPE } from './idle';
import { Tuple, tuple, TUPLE_OBJECT_TYPE } from './tuple';
import { Container, CONTAINER_OBJECT_TYPE, wrap } from './container';
import {
  maybe,
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

const TYPE_TO_MONAD: Record<string, Function> = {
  [LIST_OBJECT_TYPE]: list,
  [IDLE_OBJECT_TYPE]: (value: unknown) => idle(() => value),
  [TUPLE_OBJECT_TYPE]: (values: ReadonlyArray<unknown>) => tuple(...values),
  [CONTAINER_OBJECT_TYPE]: wrap,
  [OPTION_SOME_OBJECT_TYPE]: maybe,
  [OPTION_NONE_OBJECT_TYPE]: maybe,
  [EITHER_LEFT_OBJECT_TYPE]: left,
  [EITHER_RIGHT_OBJECT_TYPE]: right,
};

/**
 * Add recognition of `Container`, `Maybe`, `List`, `Tuple`,
 * `Idle` `Either` and `Error` data structures for `JSON.parse`.
 *
 * **Note**: constructing an `Error` is supported only from
 * `SerializabledObject<string>` structure.
 */
export const reviver = (
  _key: string,
  value: JSONValueTypes | SerializabledObject<unknown>,
):
  | JSONValueTypes
  | Idle<any>
  | List<any>
  | Option<any>
  | Container<any>
  | Either<any, any>
  | Tuple<ReadonlyArray<any>> =>
  isObject(value) && 'type' in value && 'value' in value
    ? TYPE_TO_MONAD[value['type'] as string]?.(value['value']) ?? value
    : value;
