import { some, isOption, none, maybe } from '../src/option';

describe('Option', () => {
  test('isOption checks if value is instance of Option', () => {
    expect(isOption(none)).toBe(true);
    expect(isOption(some(9))).toBe(true);
  });

  test('none object is Option with None state', () => {
    expect(none.isNone()).toBe(true);
  });

  test('maybe function returns None or Some instance depending of type of value', () => {
    expect(maybe(null).isNone()).toBe(true);
    expect(maybe(undefined).isNone()).toBe(true);
    expect(maybe(5).isSome()).toBe(true);
    expect(maybe({}).isSome()).toBe(true);
  });

  test('some function creates Option with Some state', () => {
    expect(some(8).isSome()).toBe(true);
    expect(some(null).isNone()).toBe(false);
  });

  test('extract method return inner value of Option', () => {
    expect(some(8).extract()).toBe(8);
    expect(none.extract()).toBe(null);
  });

  test('map method of Option invokes only if Option has Some state', () => {
    // @ts-expect-error
    const result = none.map((u) => u * u).extract();

    expect(result).toBe(null);

    const result2 = some(2)
      .map((u) => u * u)
      .extract();

    expect(result2).toBe(4);
  });

  test('apply method of Option invokes only if this Option and other has Some state', () => {
    // @ts-expect-error
    const result = none.apply(some((u) => u * u)).extract();

    expect(result).toBe(null);

    const result2 = some(2)
      .apply(some((u: number) => u * u))
      .extract();

    expect(result2).toBe(4);
  });

  test('chain method of Option invokes only if Option has Some state', () => {
    // @ts-expect-error
    const result = none.chain((u) => some(u * u)).extract();

    expect(result).toBe(null);

    const result2 = some(2)
      .chain((u) => some(u * u))
      .extract();

    expect(result2).toBe(4);
  });

  test('fill method set default value for Option if it has None state', () => {
    expect(none.fill(() => 2).extract()).toBe(2);
  });

  test('should be serializable', () => {
    const s1 = JSON.stringify(some(1));
    const s2 = JSON.stringify(none);

    expect(s1).toMatch('"type":"Some"');
    expect(s1).toMatch('"value":1');

    expect(s2).toMatch('"type":"None"');
    expect(s2).toMatch('"value":null');
  });
});
