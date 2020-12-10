import { maybe, isMaybe, nothing } from '../build';

describe('Maybe', () => {
  test('isMaybe check if value is instance of Maybe', () => {
    expect(isMaybe(nothing())).toBe(true);
    expect(isMaybe(maybe(9))).toBe(true);
  });

  test('nothing function creates Maybe with Nothing state', () => {
    expect(nothing().isNothing()).toBe(true);
  });

  test('maybe function creates Maybe with Nothing or Just state depending of value.', () => {
    expect(maybe(0).isJust()).toBe(true);
    expect(maybe('0').isJust()).toBe(true);
    expect(maybe({}).isJust()).toBe(true);
    expect(maybe(null).isNothing()).toBe(true);
    expect(maybe(undefined).isNothing()).toBe(true);
    expect(maybe(maybe(8)).extract()).toBe(8);
    expect(maybe(nothing()).extract()).toBe(null);
  });

  test('extract method return inner value of Maybe', () => {
    expect(maybe(8).extract()).toBe(8);
    expect(nothing().extract()).toBe(null);
  });

  test('map method of Maybe invokes only if Maybe has Just state', () => {
    const result = nothing()
      .map((u) => u * u)
      .extract();

    expect(result).toBe(null);

    const result2 = maybe(2)
      .map((u) => u * u)
      .extract();

    expect(result2).toBe(4);
  });

  test('apply method of Maybe invokes only if Maybe has Just state', () => {
    const result = nothing()
      .apply(maybe((u) => u * u))
      .extract();

    expect(result).toBe(null);

    const result2 = maybe(2)
      .apply(maybe((u) => u * u))
      .extract();

    expect(result2).toBe(4);
  });

  test('chain method of Maybe invokes only if Maybe has Just state', () => {
    const result = nothing()
      .chain((u) => maybe(u * u))
      .extract();

    expect(result).toBe(null);

    const result2 = maybe(2)
      .chain((u) => maybe(u * u))
      .extract();

    expect(result2).toBe(4);
  });
});
