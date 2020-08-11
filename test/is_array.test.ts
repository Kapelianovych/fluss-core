import { isArray } from '../src';

describe('isArray', () => {
  test('isArray function checks if value is instance of Array', () => {
    expect(isArray([4])).toBe(true);
    expect(isArray({})).toBe(false);
    expect(isArray('4')).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
  });
});
