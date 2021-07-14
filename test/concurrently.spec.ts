import { concurrently } from '../src';

describe('concurrently', () => {
  it('should return Promise', () => {
    expect(concurrently()()).toBeInstanceOf(Promise);
  });

  it('should invoke functions with the same arguments', async () => {
    const argument = 7;

    let a: number = 0;
    let b: number = 0;

    await concurrently(
      (n: number) => void (a = n),
      (n: number) => void (b = n)
    )(argument);

    expect(a).toBe(argument);
    expect(b).toBe(argument);
  });

  it('should return array of results inside Promise', async () => {
    const fn = concurrently((n: number) => n, String);

    const result = await fn(4);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toBe(4);
    expect(result[1]).toBe('4');
  });

  it('should handle synchronous functions with asynchronous ones', async () => {
    const fn = concurrently(
      (n: number) => n,
      async (n: number) => n ** 2
    );

    const result = await fn(3);

    expect(result).toEqual([3, 9]);
  });
});
