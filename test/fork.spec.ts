import { fork } from '../src';

describe('fork', () => {
  it('should join result of functions with same input into one value', () => {
    const forkedFn = fork(
      (b: string) => (parseInt(b) > 5 ? parseInt(b) : 0),
      (u: string) => (parseInt(u) < 5 ? parseInt(u) : 0),
    )((n, h) => n + h);

    expect(forkedFn('4')).toBe(4);
  });

  it('should not return Promise with result if there is no one asynchronous function', () => {
    const forkedFn = fork(
      (b: string) => (parseInt(b) > 5 ? parseInt(b) : 0),
      (u: string) => (parseInt(u) < 5 ? parseInt(u) : 0),
    )((n, h) => n + h);

    expect(typeof forkedFn('4') === 'object').toBe(false);
  });

  test('functions in fork function except "join" accepts same input', () => {
    const forkedFn = fork(
      (b: string) => (parseInt(b) === 5 ? parseInt(b) : 0),
      (u: string) => (parseInt(u) === 5 ? parseInt(u) : 0),
    )((n, h) => n + h);

    expect(forkedFn('5')).toBe(10);
  });

  it('should handle asynchronous functions', () => {
    const forkedFn = fork(
      async (n: number) => n,
      async (n: number) => n ** 2,
    )((n, a) => n * a);

    const result = forkedFn(2);

    expect(result).toBeInstanceOf(Promise);
    expect(result).resolves.toBe(8);
  });

  it('should fork mixed functions', () => {
    const forkedFn = fork(async (n: number) => n, String)((n, a) => n + a);

    const result = forkedFn(2);

    expect(result).toBeInstanceOf(Promise);
    expect(result).resolves.toBe('22');
  });
});
