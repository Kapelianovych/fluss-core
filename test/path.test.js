import { path } from '../build';

describe('path', () => {
  test('path function gets number from object based on keys (string)', () => {
    const value = path('a.b', { a: { b: 1 } });

    expect(value.extract()).toBe(1);
  });

  test('path function gets number from object based on keys (array of string)', () => {
    const value = path(['a', 'b'], { a: { b: 1 } });

    expect(value.extract()).toBe(1);
  });

  test('path function gets nothing from object based on keys (array of string) if keys is not correct', () => {
    const value = path(['a', 'b', 'c'], { a: { b: 1 } });

    expect(value.isNothing()).toBe(true);
  });
});
