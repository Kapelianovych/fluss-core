import { eitherOf, isEither, right, left } from '../build';

describe('Either', () => {
  test('isEither check if value is instance of Either', () => {
    expect(isEither(right(9))).toBe(true);
    expect(isEither(left(new Error()))).toBe(true);
    expect(isEither(eitherOf(9))).toBe(true);
  });

  test('right function creates Either with Right state', () => {
    expect(right(9).isRight()).toBe(true);
  });

  test('left function creates Either with Left state', () => {
    expect(left(new Error()).isLeft()).toBe(true);
  });

  test('eitherOf function creates Either with Left or Right state depending of value.', () => {
    expect(eitherOf(0).isRight()).toBe(true);
    expect(eitherOf('0').isRight()).toBe(true);
    expect(eitherOf({}).isRight()).toBe(true);
    expect(eitherOf(new Error()).isLeft()).toBe(true);
    expect(eitherOf(new Error()).isLeft()).toBe(true);
    expect(eitherOf(right(8)).extract()).toBe(8);
    expect(eitherOf(left(new Error())).extract()).toEqual(new Error());
  });

  test('extract method return inner value of Either', () => {
    expect(right(8).extract()).toBe(8);
    expect(left(new Error()).extract()).toEqual(new Error());
  });

  test('map method of Either invokes only if Either has Right state', () => {
    const result = left(new Error())
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
      .chain((u) => right(u * u))
      .extract();

    expect(result).toEqual(new Error());

    const result2 = right(2)
      .chain((u) => right(u * u))
      .extract();

    expect(result2).toEqual(4);
  });
});
