import { curry } from '../build';

describe('curry', () => {
  test('should curry function with two arguments', () => {
    const curriedFn = curry((n, a) => a + n);

    expect(typeof curriedFn).toBe('function');
    expect(typeof curriedFn(8)).toBe('function');
    expect(curriedFn(8)(8)).toBe(16);
    expect(curriedFn(8, 8)).toBe(16);
  });

  test('should discard exessive arguments', () => {
    const curried = curry((f, s) => f + s);

    expect(curried(1, 2, 3)).toBe(3);
    expect(curried(1)(2, 3)).toBe(3);
  });
});
