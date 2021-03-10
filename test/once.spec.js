import { jest } from '@jest/globals';
import { once } from '../build/index.js';

describe('once', () => {
  let func;

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
});
