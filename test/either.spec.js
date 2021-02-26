import { isEither, right, left } from '../build';

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

  test('handle method should transform Left state into Right state', () => {
    expect(
      left(8)
        .handle(() => '')
        .type()
    ).toBe('Right');
  });

  test('should be serializable', () => {
    const e1 = JSON.stringify(right(1));
    const e2 = JSON.stringify(left('Wrong type!'));

    expect(e1).toMatch('"type":"Right"');
    expect(e1).toMatch('"value":1');

    expect(e2).toMatch('"type":"Left"');
    expect(e2).toMatch('"value":"Wrong type!"');
  });
});
