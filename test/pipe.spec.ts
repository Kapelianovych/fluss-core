import { pipe } from '../src/pipe';

describe('pipe', () => {
  test('should compose two functions and return function.', () => {
    const composedFn = pipe(
      (n: number) => `${n} is number`,
      (n) => n + '!',
    );

    expect(composedFn(9)).toBe('9 is number!');
  });

  test(
    'if pipe function has not arguments it must return ' +
      'array of provided arguments of composed function.',
    () => {
      // @ts-expect-error
      const composedFn: any = pipe();

      expect(composedFn(6, 5, 4)).toEqual([6, 5, 4]);
    },
  );

  test('should compose asynchronous functions.', async () => {
    const composed = pipe(
      async (s: string) => s,
      async (s: string) => parseInt(s),
    );

    expect(await composed('1')).toBe(1);
  });

  test('should compose synchronous and asynchronous functions.', async () => {
    const composed = pipe(async (s: string) => s, parseInt);

    expect(await composed('1')).toBe(1);
  });

  it('should compose functions with one mandatory parameter and with variadic parameter', () => {
    const composed = pipe(
      (n: number) => n,
      (...args: Array<number>) => args.reduce((a, c) => a + c, 0),
    );

    expect(composed(1)).toBe(1);
  });
});
