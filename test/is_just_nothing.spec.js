import { isNothing, isJust } from '../build';

describe('isNothing and isJust', () => {
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

  test('isJust function checks if value is not null and undefined', () => {
    expect(isJust(8)).toBe(true);
    expect(isJust('8')).toBe(true);
    expect(isJust(false)).toBe(true);
    expect(isJust({})).toBe(true);
    expect(isJust(null)).toBe(false);
    expect(isJust(undefined)).toBe(false);
  });
});
