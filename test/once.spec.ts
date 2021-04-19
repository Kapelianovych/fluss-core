import { jest } from '@jest/globals';
import { isOption, once } from '../src';

describe('once', () => {
  let func: (...args: unknown[]) => unknown;

  beforeEach(() => (func = jest.fn()));

  test('without once function should be called as usual', () => {
    func();
    func();
    func();

    expect(func).toHaveBeenCalledTimes(3);
  });

  test('should invoke function only once', () => {
    const onced = jest.fn(once(func));

    onced();
    onced();
    onced();

    expect(onced).toHaveBeenCalledTimes(3);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should invoke only after function if main function has already been called.', () => {
    const after = jest.fn();
    const onced = once(func, after);

    onced();
    expect(func).toHaveBeenCalledTimes(1);
    expect(after).toHaveBeenCalledTimes(0);

    onced();
    expect(func).toHaveBeenCalledTimes(1);
    expect(after).toHaveBeenCalledTimes(1);

    onced();
    expect(func).toHaveBeenCalledTimes(1);
    expect(after).toHaveBeenCalledTimes(2);
  });

  test('should return result of function as Option if only first argument is provided', () => {
    const onced = once(() => '');
    const result = onced();

    expect(isOption(result)).toBe(true);
    expect(result.extract()).toBe('');
    expect(onced().isNone()).toBe(true);
    expect(onced().isNone()).toBe(true);
  });

  test('should return always the result of second function after second invocation', () => {
    const onced = once(
      () => 'f',
      () => 's'
    );

    expect(onced()).toBe('f');
    expect(onced()).toBe('s');
    expect(onced()).toBe('s');
  });
});
