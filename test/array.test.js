import { array } from '../build';

describe('array', () => {
  test('array creates an array from iterables and array-like objects', () => {
    expect(typeof array([9], new Set([6]), { 0: 6, length: 1 })).toBe('object');
    expect(Array.isArray(array([9], new Set([6]), { 0: 6, length: 1 }))).toBe(
      true
    );
    expect(array([9], new Set([6]), { 0: 6, length: 1 })).toEqual([9, 6, 6]);
  });

  test('array creates an array with iterable, array-like and value', () => {
    const testArray = array(6, [5], { 0: 8, length: 1 });
    expect(testArray).toEqual([6, 5, 8]);
  });
});
