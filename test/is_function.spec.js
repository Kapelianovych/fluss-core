import { isFunction } from '../build/index.js';

describe('isFunction', () => {
  test('should return true if value is function', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(function a() {})).toBe(true);
  });

  test('should return false if value is not a function', () => {
    expect(isFunction(1)).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction('')).toBe(false);
    expect(isFunction({})).toBe(false);
  });
});
