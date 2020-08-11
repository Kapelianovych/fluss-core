import { isNothing } from '../src';

describe('isNothing', () => {
  test('isNothing function checks if value is null or undefined', () => {
    expect(isNothing(4)).toBe(false);
    expect(isNothing('4')).toBe(false);
    expect(isNothing(null)).toBe(true);
    expect(isNothing(undefined)).toBe(true);
  });

  test('isNothing function does not check for falsey values', () => {
    expect(isNothing(NaN)).toBe(false);
    expect(isNothing('')).toBe(false);
    expect(isNothing(0)).toBe(false);
  });
});
