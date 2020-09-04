import { wrap, isWrapper } from '../src';

describe('wrapper', () => {
  test('wrap function wraps value into Wrapper', () => {
    expect(typeof wrap(4)).toBe('object');
  });

  test('wrap function wraps value into Wrapper and extract it', () => {
    expect(wrap(4).extract()).toBe(4);
    expect(wrap(wrap(4)).extract()).toBe(4);
  });

  test('wrap function wraps value into Wrapper and can map it', () => {
    expect(
      wrap(4)
        .map((u) => String(u))
        .extract()
    ).toBe('4');

    expect(
      wrap(4)
        .chain((u) => wrap(String(u)))
        .extract()
    ).toBe('4');

    expect(
      wrap(4)
        .apply(wrap((u) => String(u)))
        .extract()
    ).toBe('4');
  });

  test('isWrapper checks if value is Wrapper instance', () => {
    expect(isWrapper(wrap(8))).toBe(true);
    expect(isWrapper('')).toBe(false);
  });
});
