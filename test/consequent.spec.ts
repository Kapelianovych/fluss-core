import { consequent, isOption } from '../src';

describe('consequent', () => {
  it('should invoke function as usual', () => {
    const fn = jest.fn();
    consequent(fn)();
    expect(fn).toBeCalled();
  });

  it('should not invoke function if it is running', () => {
    const fn = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 50)));

    const wrappedFunction = consequent(fn);

    wrappedFunction();
    wrappedFunction();
    wrappedFunction();

    expect(fn).toBeCalledTimes(1);
  });

  it('should return option object', () => {
    const result = consequent(() => {})();
    expect(isOption(result)).toBe(true);
  });

  it('should signal if function is running', () => {
    const wrappedFunction = consequent(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    );

    expect(wrappedFunction.busy).toBe(false);

    wrappedFunction();

    expect(wrappedFunction.busy).toBe(true);
  });
});
