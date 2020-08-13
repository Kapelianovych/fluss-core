import { concat } from '../src';

describe('concat', () => {
  test("concat function joins array's and set's element into one array", () => {
    const array = concat([9, 8], new Set([1, 2]));
    expect(array).toEqual([9, 8, 1, 2]);
    expect(Array.isArray(array)).toBe(true);
  });

  test("concat function joins array-like's element into one array", () => {
    expect(
      concat({ 0: 1, 1: 2, length: 2 }, { 0: 3, 1: 4, length: 2 })
    ).toEqual([1, 2, 3, 4]);
  });
});
