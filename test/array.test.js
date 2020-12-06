import { array } from '../build';

describe('array', () => {
  test('array creates an array from iterables', () => {
    expect(typeof array([9], new Set([6]), { 0: 6, length: 1 })).toBe(
      'object'
    );
    expect(
      Array.isArray(array([9], new Set([6]), { 0: 6, length: 1 }))
    ).toBe(true);
    expect(array([9], new Set([6]), { 0: 6, length: 1 })).toEqual([
      9,
      6,
      6,
    ]);
  });
});
