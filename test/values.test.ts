import { values } from '../src';

describe('values', () => {
  test('values function gets values of object', () => {
    const vals = values({ k: 3, i: 7, o: 9 });

    expect(Array.isArray(vals)).toBe(true);
    expect(vals).toEqual([3, 7, 9]);
  });

  test('values function gets values of Set', () => {
    const vals = values(new Set([1, 2, 3]));

    expect(Array.isArray(vals)).toBe(true);
    expect(vals).toEqual([1, 2, 3]);
  });

  test('values function gets values of Map', () => {
    const vals = values(
      new Map([
        ['u', 1],
        ['o', 2],
        ['r', 3],
      ])
    );

    expect(Array.isArray(vals)).toBe(true);
    expect(vals).toEqual([1, 2, 3]);
  });

  test('values function gets values of Array', () => {
    const vals = values([1, 2, 3]);

    expect(Array.isArray(vals)).toBe(true);
    expect(vals).toEqual([1, 2, 3]);
  });
});
