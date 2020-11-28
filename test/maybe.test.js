import { maybeOf, isMaybe, just, nothing } from '../build';

describe('Maybe', () => {
  test('isMaybe check if value is instance of Maybe', () => {
    expect(isMaybe(just(9))).toBe(true);
    expect(isMaybe(nothing())).toBe(true);
    expect(isMaybe(maybeOf(9))).toBe(true);
  });

  test('just function creates Maybe with Just state', () => {
    expect(just(9).isJust()).toBe(true);
  });

  test('nothing function creates Maybe with Nothing state', () => {
    expect(nothing().isNothing()).toBe(true);
  });

  test('maybeOf function creates Maybe with Nothing or Just state depending of value.', () => {
    expect(maybeOf(0).isJust()).toBe(true);
    expect(maybeOf('0').isJust()).toBe(true);
    expect(maybeOf({}).isJust()).toBe(true);
    expect(maybeOf(null).isNothing()).toBe(true);
    expect(maybeOf(undefined).isNothing()).toBe(true);
    expect(maybeOf(just(8)).extract()).toBe(8);
    expect(maybeOf(nothing()).extract()).toBe(null);
  });

  test('extract method return inner value of Maybe', () => {
    expect(just(8).extract()).toBe(8);
    expect(nothing().extract()).toBe(null);
  });

  test('map method of Maybe invokes only if Maybe has Just state', () => {
    const result = nothing()
      .map((u) => u * u)
      .extract();

    expect(result).toBe(null);

    const result2 = just(2)
      .map((u) => u * u)
      .extract();

    expect(result2).toBe(4);
  });

  test('apply method of Maybe invokes only if Maybe has Just state', () => {
    const result = nothing()
      .apply(just((u) => u * u))
      .extract();

    expect(result).toBe(null);

    const result2 = just(2)
      .apply(just((u) => u * u))
      .extract();

    expect(result2).toBe(4);
  });

  test('chain method of Maybe invokes only if Maybe has Just state', () => {
    const result = nothing()
      .chain((u) => just(u * u))
      .extract();

    expect(result).toBe(null);

    const result2 = just(2)
      .chain((u) => just(u * u))
      .extract();

    expect(result2).toBe(4);
  });
});
