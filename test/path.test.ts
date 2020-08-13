import { path } from '../src';

describe('path', () => {
  test('path function gets number from object based on keys (string)', () => {
    const value = path<number>('a.b', { a: { b: 1 } });

    expect(value.extract()).toBe(1);
  });

  test('path function gets number from object based on keys (array of string)', () => {
    const value = path<number>(['a', 'b'], { a: { b: 1 } });

    expect(value.extract()).toBe(1);
  });

  test('path function gets nothing from object based on keys (array of string) if keys is not correct', () => {
    const value = path<number>(['a', 'b', 'c'], { a: { b: 1 } });

    expect(value.isNothing()).toBe(true);
  });
});
