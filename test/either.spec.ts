import {
  left,
  right,
  either,
  isEither,
  EITHER_LEFT_OBJECT_TYPE,
  EITHER_RIGHT_OBJECT_TYPE,
} from '../src';

describe('Either', () => {
  test('isEither check if value is instance of Either type', () => {
    expect(isEither(right(9))).toBe(true);
    expect(isEither(left(new Error()))).toBe(true);
  });

  test('right function creates Either with Right state', () => {
    expect(right(9).isRight()).toBe(true);
  });

  test('left function creates Either with Left state', () => {
    expect(left(new Error()).isLeft()).toBe(true);
  });

  test(
    'either function returns instance of Left or Right state based ' +
      'on isRight predicate function',
    () => {
      // @ts-ignore
      expect(either((value) => typeof value === 'string', '').isRight()).toBe(
        true
      );
      // @ts-ignore
      expect(either((value) => typeof value === 'string', '').isLeft()).toBe(
        false
      );
      expect(either(Array.isArray, '').isLeft()).toBe(true);
      expect(either(Array.isArray, '').isRight()).toBe(false);
    }
  );

  test('extract method return inner value of Either', () => {
    expect(right(8).extract()).toBe(8);
    expect(left(new Error()).extract()).toEqual(new Error());
  });

  test('map method of Either invokes only if Either has Right state', () => {
    const result = left(new Error())
      // @ts-expect-error
      .map((u) => u * u)
      .extract();

    expect(result).toEqual(new Error());

    const result2 = right(2)
      .map((u) => u * u)
      .extract();

    expect(result2).toEqual(4);
  });

  test('apply method of Either invokes only if Either has Right state', () => {
    const result = left(new Error())
      // @ts-expect-error
      .apply(right((u) => u * u))
      .extract();

    expect(result).toEqual(new Error());

    const result2 = right(2)
      .apply(right((u) => u * u))
      .extract();

    expect(result2).toEqual(4);
  });

  test('chain method of Either invokes only if Either has Right state', () => {
    const result = left(new Error())
      // @ts-expect-error
      .chain((u) => right(u * u))
      .extract();

    expect(result).toEqual(new Error());

    const result2 = right(2)
      .chain((u) => right(u * u))
      .extract();

    expect(result2).toEqual(4);
  });

  test('handle method should transform Left state into Right state', () => {
    expect(
      left(8)
        .handle(() => '')
        .type()
    ).toBe(EITHER_RIGHT_OBJECT_TYPE);
  });

  test('should be serializable', () => {
    const e1 = JSON.stringify(right(1));
    const e2 = JSON.stringify(left('Wrong type!'));

    expect(e1).toMatch(`"type":"${EITHER_RIGHT_OBJECT_TYPE}"`);
    expect(e1).toMatch('"value":1');

    expect(e2).toMatch(`"type":"${EITHER_LEFT_OBJECT_TYPE}"`);
    expect(e2).toMatch('"value":"Wrong type!"');
  });
});
