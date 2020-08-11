import { arrayOf } from '../src';

describe('arrayOf', () => {
  test('arrayOf creates an array from elements', () => {
    expect(typeof arrayOf(9, 8, 7)).toBe('object');
    expect(Array.isArray(arrayOf(9, 8, 7))).toBe(true);
    expect(arrayOf(9, 8, 7)).toEqual([9, 8, 7]);
  });
});
