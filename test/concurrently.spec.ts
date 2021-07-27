import { concurrently } from '../src';

describe('concurrently', () => {
  it('should return Promise', () => {
    expect(concurrently()()).toBeInstanceOf(Promise);
  });

  it('should return array of results inside Promise', async () => {
    const fn = concurrently((n: number) => n, String);

    const result = await fn(4, ['foo']);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toBe(4);
    expect(result[1]).toBe('foo');
  });

  it('should handle synchronous functions with asynchronous ones', async () => {
    const fn = concurrently(
      (n: number) => n,
      async (n: number) => n ** 2
    );

    const result = await fn(3, 4);

    expect(result).toEqual([3, 16]);
  });

  it('should not accept arguments for last function that does not have parameters', async () => {
    const fn = concurrently(
      (n: number) => n,
      () => 2
    );

    const result = await fn(3);

    expect(result).toEqual([3, 2]);
  });

  it('should accept empty array as arguments for not last function that does not have parameters', async () => {
    const fn = concurrently(
      () => 2,
      async (n: number) => n ** 2
    );

    const result = await fn([], 4);

    expect(result).toEqual([2, 16]);
  });

  it('should accept array of values when function have two or more parameters', async () => {
    const fn = concurrently(
      (n: number) => n,
      (n: number, a: number) => n ** 2 * 3
    );

    const result = await fn(3, [4, 6]);

    expect(result).toEqual([3, 48]);
  });
});
