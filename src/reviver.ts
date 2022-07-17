import { isJust } from './is_just.js';
import { isObject } from './is_object.js';
import { List, LIST_TYPE } from './list.js';
import { Idle, IDLE_TYPE } from './idle.js';
import { None, Option, OPTION_TYPE, Some } from './option.js';
import { Err, Ok, Result, RESULT_TYPE, ResultState } from './result.js';

type EncodedMonad<T> = {
  readonly type: string;
  readonly value: T;
};

export type JSONValueTypes =
  | null
  | string
  | number
  | boolean
  | readonly unknown[]
  | Record<string, unknown>;

const isEncoded = (value: object): value is EncodedMonad<any> =>
  'type' in value && 'value' in value;

export const reviver = (
  _key: string,
  value: JSONValueTypes | EncodedMonad<any>,
): JSONValueTypes | Idle<any> | List<any> | Option<any> | Result<any, any> => {
  if (isObject(value) && isEncoded(value)) {
    switch (value.type) {
      case OPTION_TYPE:
        return isJust(value.value) ? Some(value.value) : None;
      case LIST_TYPE:
        return List(value.value);
      case IDLE_TYPE:
        return Idle(() => value.value);
      case RESULT_TYPE:
        return value.value.state === ResultState.Ok
          ? Ok(value.value.value)
          : Err(value.value.value);
      default:
        return value;
    }
  } else {
    return value;
  }
};
