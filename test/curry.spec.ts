import { curry, _ } from '../src/curry';

describe('curry', () => {
  test('should curry function with two arguments', () => {
    const curriedFn = curry((n: number, a: number) => a + n);

    expect(typeof curriedFn).toBe('function');
    expect(typeof curriedFn(8)).toBe('function');
    expect(curriedFn(8)(8)).toBe(16);
    expect(curriedFn(8, 8)).toBe(16);
  });

  test('should discard excessive arguments', () => {
    const curried = curry((f: number, s: number) => f + s);

    // @ts-expect-error
    expect(curried(1, 2, 3)).toBe(3);
    // @ts-expect-error
    expect(curried(1)(2, 3)).toBe(3);
  });

  it('should preserve parameters if placeholder is provide', () => {
    const fn = curry((value: number) => value);

    const curriedFn = fn(_);

    expect(typeof curriedFn()).toBe('function');
  });

  it('should preserve place for argument in the middle of parameters list', () => {
    const curried = curry((n: number, s: string, b: boolean) => (b ? n : s));

    const fn = curried(9, _, false);

    expect(typeof fn).toBe('function');
    expect(fn('ho')).toMatch('ho');
  });

  it('should preserve place in the start of parameters list', () => {
    const curried = curry((n: number, s: string) => n + s);

    const fn = curried(_, '');

    expect(typeof fn).toBe('function');
    expect(fn(12)).toMatch('12');
  });

  it('should correctly infer types for two or more gaps', () => {
    const sendData = (
      href: string,
      method: string,
      data: string,
    ): Promise<string> => Promise.resolve(href + method + data);

    const curriedFn = curry(sendData)(_, _, 'data');

    expect(curriedFn('h', 'p')).resolves.toMatch('hpdata');
  });

  it('should preserve correct types for function parameters', () => {
    const sendData = (
      href: string,
      method: number,
      body: object,
      ...headers: Record<string, string>[]
    ): string =>
      href +
      String(method) +
      JSON.stringify(body) +
      headers.map((value) => JSON.stringify(value));

    const curriedSendData = curry(sendData);

    const sendDataWithHref = curriedSendData('https://api.halo-lab.com/data');
    expect(typeof sendDataWithHref).toBe('function');

    const sendDataWithHrefAndMethod = curriedSendData(
      'https://api.halo-lab.com/data',
      1,
    );
    expect(typeof sendDataWithHrefAndMethod).toBe('function');
    expect(typeof sendDataWithHrefAndMethod({})).toBe('string');
  });

  it('should return a function with the same parameters when all arguments were the placeholder', () => {
    const sendData = (
      href: string,
      method: string,
      data: string,
    ): Promise<string> => Promise.resolve(href + method + data);

    const curriedFn = curry(sendData)(_, _, _);

    expect(curriedFn('h', 'p', 'data')).resolves.toMatch('hpdata');
  });

  it('should define arity for function with only variadic parameter', () => {
    // For ReadonlyArray<number> [there is a bug](https://github.com/microsoft/TypeScript/issues/37193),
    // so we should review it again in TypeScript ~v4.4.1
    const testFn = (...args: Array<number>) => args;

    const curried = curry(testFn, 3);

    const fn = curried();

    expect(typeof fn).toMatch('function');

    const fn1 = fn(1, 4);
    expect(typeof fn1).toMatch('function');

    const result = fn1(5);
    expect(result).toEqual([1, 4, 5]);
  });

  it('should handle function with fixed and variadic parameters', () => {
    const testFn = (s: string, ...numbers: ReadonlyArray<number>) =>
      s + numbers.join('');
    const curried = curry(testFn);

    const fn = curried();

    expect(fn('0')).toMatch('0');
    // @ts-expect-error
    expect(fn('0', 1, 2, 3)).toMatch('0');
  });

  it('should handle function with fixed and variadic parameters and apparent arity', () => {
    const testFn = (s: string, ...numbers: ReadonlyArray<number>) =>
      s + numbers.join('');
    const curried = curry(testFn, 3);

    const fn = curried();

    expect(typeof fn('0', 1)).toMatch('function');
    expect(fn('0', 1, 2)).toMatch('012');
  });
});
