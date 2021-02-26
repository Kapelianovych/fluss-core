import {
  isList,
  isIdle,
  isTuple,
  reviver,
  isEither,
  isOption,
  isContainer,
} from '../build';

describe('reviver', () => {
  test('should skip values that are not Option, Either and List', () => {
    const json = '{"h":1}';
    expect(JSON.parse(json, reviver)).toBeInstanceOf(Object);
  });

  test('should create Option instance', () => {
    const json = '{"type":"Some","value":1}';
    expect(isOption(JSON.parse(json, reviver))).toBe(true);
  });

  test('should create List instance', () => {
    const json = '{"type":"List","value":[1]}';
    expect(isList(JSON.parse(json, reviver))).toBe(true);
  });

  test('should create Either instance with Right state', () => {
    const json = '{"type":"Right","value":1}';
    expect(isEither(JSON.parse(json, reviver))).toBe(true);
    expect(JSON.parse(json, reviver).isRight()).toBe(true);
  });

  test('should create Either instance with Left state', () => {
    const json = '{"type":"Left","value":"Message!"}';
    expect(isEither(JSON.parse(json, reviver))).toBe(true);
    expect(JSON.parse(json, reviver).isLeft()).toBe(true);
  });

  test('should create Container instance', () => {
    const json = '{"type":"Container","value":5}';
    expect(isContainer(JSON.parse(json, reviver))).toBe(true);
  });

  test('should create Tuple instance', () => {
    const json = '{"type":"Tuple","value":[5]}';
    expect(isTuple(JSON.parse(json, reviver))).toBe(true);
  });

  test('should create an Idle instance', () => {
    const json = '{"type":"Idle","value":7}';
    expect(isIdle(JSON.parse(json, reviver))).toBe(true);
  });
});
