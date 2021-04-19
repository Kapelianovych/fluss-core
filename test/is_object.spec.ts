import { isObject } from '../src/is_object';

describe('isObject', () => {
  test('should return true on object value', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(new Set())).toBe(true);
  });

  test('should return false on null and any other non-object value', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(() => {})).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject('')).toBe(false);
    expect(isObject(false)).toBe(false);
  });
});
