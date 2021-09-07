import { sequentially } from '../src/sequentially';

describe('sequentially', () => {
  test('sequentially function executes functions with their respected values', () => {
    let stringValue = '';
    const concatNumberAsString = sequentially(
      (n: number) => (stringValue += n),
      (b: string) => (stringValue += b),
      (u: string) => (stringValue += u),
    );
    concatNumberAsString(0, '1', '2');

    expect(stringValue).toBe('012');
  });

  test('should be able to execute mixed functions in order that they are declared and return promise', async () => {
    let text = '';
    const s = sequentially(
      (num: number) =>
        new Promise((resolve) => setTimeout(() => resolve((text += num)), 100)),
      (num: number) => (text += num + 1),
      async (num: number) => (text += num + 2),
    );

    const result = s(1, 1, 2);

    expect(result).toBeInstanceOf(Promise);

    expect(await result).toEqual(['1', '12', '124']);
    expect(text).toBe('124');
  });

  it('should execute asynchronous functions one after another', async () => {
    let text = '';
    const s = sequentially(
      () =>
        new Promise<void>((resolve) =>
          setTimeout(() => ((text += 1), resolve()), 200),
        ),
      () =>
        new Promise<void>((resolve) =>
          setTimeout(() => ((text += 2), resolve()), 150),
        ),
      () =>
        new Promise<void>((resolve) =>
          setTimeout(() => ((text += 3), resolve()), 100),
        ),
    );

    await s();

    expect(text).toMatch('123');
  });

  it('should execute synchronous functions one after another', () => {
    let text = '';
    const s = sequentially(
      () => (text += 1),
      () => (text += 2),
      () => (text += 3),
    );

    s();

    expect(text).toMatch('123');
  });

  it('should return result of synchronous functions as array', () => {
    const fn = sequentially(
      (n: number) => n,
      (n: number) => n ** 2,
    );

    const result = fn(2, 3);

    expect(result).toEqual([2, 9]);
  });

  it('should return result of mixed functions as Promise of array', async () => {
    const fn = sequentially(
      (n: number) => n,
      async (n: number) => n ** 2,
    );

    const result = fn(2, 4);

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual([2, 16]);
  });

  it('should accept array of arrays if functions accept two or more arguments', () => {
    const fn = sequentially(
      (n: number, y: number) => n + y,
      (s: string, h: string) => s + h,
    );

    const result = fn([1, 2], ['3', '4']);
    expect(result).toEqual([3, '34']);
  });

  it('should accept array of arrays or values if functions accept one, two or more arguments', () => {
    const fn = sequentially(
      (n: number) => n ** 2,
      (s: string, h: string) => s + h,
    );

    const result = fn(2, ['3', '4']);
    expect(result).toEqual([4, '34']);
  });

  it('should omit arguments for last function', () => {
    const fn = sequentially(
      (n: number) => n ** 2,
      () => 'foo',
    );

    const result = fn(2);
    expect(result).toEqual([4, 'foo']);
  });

  it(
    'should not omit arguments for function not at the end if it does not accept any arguments ' +
      'and it should accept empty array',
    () => {
      const fn = sequentially(
        () => 'foo',
        (n: number) => n ** 2,
      );

      const result = fn([], 2);
      expect(result).toEqual(['foo', 4]);
    },
  );

  it('should accept one parameter if it is the same for all functions', () => {
    const fn = sequentially(
      (word: string) => word + ' world!',
      (word: string) => word + ' IT!',
    );

    const result = fn('Hello');

    expect(result).toEqual(['Hello world!', 'Hello IT!']);
  });
});
