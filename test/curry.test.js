import { curry } from '../build';

describe('curry', () => {
  test('curry function curry function with two arguments', () => {
    const curriedFn = curry((n, a) => a + n);

    expect(typeof curriedFn).toBe('function');
    expect(typeof curriedFn(8)).toBe('function');
    expect(curriedFn(8)(8)).toBe(16);
    expect(curriedFn(8, 8)).toBe(16);
  });
});
