import {
  isList,
  isIdle,
  reviver,
  isEither,
  isOption,
  LIST_OBJECT_TYPE,
  IDLE_OBJECT_TYPE,
  OPTION_SOME_OBJECT_TYPE,
  EITHER_LEFT_OBJECT_TYPE,
  EITHER_RIGHT_OBJECT_TYPE,
} from '../src';

describe('reviver', () => {
  test('should skip values that are not Option, Either and List', () => {
    const json = '{"h":1}';
    expect(JSON.parse(json, reviver)).toBeInstanceOf(Object);
  });

  test('should create Option instance', () => {
    const json = `{"type":"${OPTION_SOME_OBJECT_TYPE}","value":1}`;
    expect(isOption(JSON.parse(json, reviver))).toBe(true);
  });

  test('should create List instance', () => {
    const json = `{"type":"${LIST_OBJECT_TYPE}","value":[1]}`;
    expect(isList(JSON.parse(json, reviver))).toBe(true);
  });

  test('should create Either instance with Right state', () => {
    const json = `{"type":"${EITHER_RIGHT_OBJECT_TYPE}","value":1}`;
    expect(isEither(JSON.parse(json, reviver))).toBe(true);
    expect(JSON.parse(json, reviver).isRight()).toBe(true);
  });

  test('should create Either instance with Left state', () => {
    const json = `{"type":"${EITHER_LEFT_OBJECT_TYPE}","value":"Message!"}`;
    expect(isEither(JSON.parse(json, reviver))).toBe(true);
    expect(JSON.parse(json, reviver).isLeft()).toBe(true);
  });

  test('should create an Idle instance', () => {
    const json = `{"type":"${IDLE_OBJECT_TYPE}","value":7}`;
    expect(isIdle(JSON.parse(json, reviver))).toBe(true);
  });
});
