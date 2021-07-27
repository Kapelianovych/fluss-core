import { fork } from '../src/fork';

describe('fork', () => {
  test('fork function join result of functions with same input into one value', () => {
    const forkedFn = fork(
      (b: string) => (parseInt(b) > 5 ? parseInt(b) : 0),
      (u: string) => (parseInt(u) < 5 ? parseInt(u) : 0)
    )((n, h) => n + h);

    expect(forkedFn('4')).resolves.toBe(4);
  });

  test('functions in fork function except "join" accepts same input', () => {
    const forkedFn = fork(
      (b: string) => (parseInt(b) === 5 ? parseInt(b) : 0),
      (u: string) => (parseInt(u) === 5 ? parseInt(u) : 0)
    )((n, h) => n + h);

    expect(forkedFn('5')).resolves.toBe(10);
  });

  it('should handle asynchronous functions', () => {
    const forkedFn = fork(
      async (n: number) => n,
      async (n: number) => n ** 2
    )((n, a) => n * a);

    const result = forkedFn(2);

    expect(result instanceof Promise).toBe(true);
    expect(result).resolves.toBe(8);
  });

  it('should fork mixed functions', () => {
    const forkedFn = fork(async (n: number) => n, String)((n, a) => n + a);

    const result = forkedFn(2);

    expect(result instanceof Promise).toBe(true);
    expect(result).resolves.toBe('22');
  });
});
