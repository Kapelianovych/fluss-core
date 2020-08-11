import { resolve } from '../src';

describe('resolve', () => {
  test('resolve creates resolved promise', () => {
    expect(resolve()).resolves.toBeFalsy();
    expect(resolve(5)).resolves.toBe(5);
  });
});
