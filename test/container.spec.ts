import { wrap, isContainer } from '../src/container';

describe('Container', () => {
  test('wrap function wraps value into Container', () => {
    expect(typeof wrap(4)).toBe('object');
  });

  test('wrap function wraps value into Container and extract it', () => {
    expect(wrap(4).extract()).toBe(4);
  });

  test('wrap function wraps value into Container and can map it', () => {
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

  test('isContainer checks if value is Container instance', () => {
    expect(isContainer(wrap(8))).toBe(true);
    expect(isContainer('')).toBe(false);
  });

  test('should be serializable', () => {
    expect(wrap(5).toJSON()).toEqual({ type: 'Container', value: 5 });
  });
});
