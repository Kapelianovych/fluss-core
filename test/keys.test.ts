import { keys } from '../src';

describe('keys', () => {
  test('keys function returns an array of keys of object', () => {
    const keysArray = keys({ u: 4, i: 'u' });

    expect(Array.isArray(keysArray)).toBe(true);
    expect(keysArray.every((item) => typeof item === 'string')).toBe(true);
    expect(keysArray).toEqual(['u', 'i']);
  });
});
