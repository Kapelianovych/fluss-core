import { reduce } from '../src';

describe('reduce', () => {
  test('reduce function sum values of array with initial value', () => {
    expect(reduce([1, 2, 3, 4, 5], (s, n) => s + n, 0)).toBe(15);
  });

  test('reduce function sum values of array without initial value', () => {
    expect(reduce([1, 2, 3, 4, 5], (s, n) => s + n)).toBe(15);
  });

  test('reduce function convert array of numbers to one string', () => {
    expect(reduce([1, 2, 3, 4, 5], (s, n) => s + n, '')).toBe('12345');
  });
});
