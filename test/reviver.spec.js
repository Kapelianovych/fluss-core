import { isEither, isList, isMaybe, reviver } from '../build';

describe('reviver', () => {
  test('should skip values that are not Maybe, Either and List', () => {
    const json = '{"h":1}';
    expect(JSON.parse(json, reviver)).toBeInstanceOf(Object);
  });

  test('should create Maybe instance', () => {
    const json = '{"type":"Maybe","value":1}';
    expect(isMaybe(JSON.parse(json, reviver))).toBe(true);
  });

  test('should create List instance', () => {
    const json = '{"type":"List","value":[1]}';
    expect(isList(JSON.parse(json, reviver))).toBe(true);
  });

  test('should create Either instance with Just state', () => {
    const json = '{"type":"Either","value":1}';
    expect(isEither(JSON.parse(json, reviver))).toBe(true);
    expect(JSON.parse(json, reviver).isRight()).toBe(true);
  });

  test('should create Either instance with Left state', () => {
    const json =
      '{"type":"Either","value":{"type":"Error","value":"Message!"}}';
    expect(isEither(JSON.parse(json, reviver))).toBe(true);
    expect(JSON.parse(json, reviver).isLeft()).toBe(true);
  });
});
