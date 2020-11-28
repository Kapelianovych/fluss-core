import { curry } from '../build';

describe('curry', () => {
  test('curry function curry function with two arguments', () => {
    const curriedFn = curry((n, a) => a + n);

    expect(typeof curriedFn).toBe('function');
    expect(typeof curriedFn(8)).toBe('function');
    expect(curriedFn(8)(8)).toBe(16);
  });

  test('curry function curry function with two arguments with default argument into single function', () => {
    const curriedFn = curry((n, a) => a + n, [8]);

    expect(typeof curriedFn).toBe('function');
    expect(curriedFn(8)).toBe(16);
  });
});
