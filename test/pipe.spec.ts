import { pipe } from '../src/pipe';

describe('pipe', () => {
  test('should compose two functions and return function.', () => {
    const composedFn = pipe(
      (n) => `${n} is number`,
      (n) => n + '!'
    );

    expect(composedFn(9)).toBe('9 is number!');
  });

  test(
    'if pipe function has not arguments it must return ' +
      'array of provided arguments of composed function.',
    () => {
      // @ts-expect-error
      const composedFn = pipe();

      expect(composedFn(6, 5, 4)).toEqual([6, 5, 4]);
    }
  );

  test('should compose asynchronous functions.', async () => {
    const composed = pipe(
      async (s: string) => s,
      async (s) => parseInt(s)
    );

    expect(await composed('1')).toBe(1);
  });

  test('should compose synchronous and asynchronous functions.', async () => {
    const composed = pipe(async (s: string) => s, parseInt);

    expect(await composed('1')).toBe(1);
  });
});
