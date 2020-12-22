import { either, isEither, right, left } from '../build';

describe('Either', () => {
  test('isEither check if value is instance of Either', () => {
    expect(isEither(right(9))).toBe(true);
    expect(isEither(left(new Error()))).toBe(true);
    expect(isEither(either(9))).toBe(true);
  });

  test('right function creates Either with Right state', () => {
    expect(right(9).isRight()).toBe(true);
  });

  test('left function creates Either with Left state', () => {
    expect(left(new Error()).isLeft()).toBe(true);
  });

  test('either function creates Either with Left or Right state depending of value.', () => {
    expect(either(0).isRight()).toBe(true);
    expect(either('0').isRight()).toBe(true);
    expect(either({}).isRight()).toBe(true);
    expect(either(new Error()).isLeft()).toBe(true);
    expect(either(new Error()).isLeft()).toBe(true);
    expect(either(right(8)).extract()).toBe(8);
    expect(either(left(new Error())).extract()).toEqual(new Error());
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

  test('should be serializable', () => {
    const e1 = JSON.stringify(right(1));
    const e2 = JSON.stringify(left(new TypeError('Wrong type!')));

    expect(e1).toMatch('"type":"Either"');
    expect(e1).toMatch('"value":1');

    expect(e2).toMatch('"type":"Either"');
    expect(e2).toMatch('"type":"Error"');
    expect(e2).toMatch('"value":"Wrong type!"');
  });
});
