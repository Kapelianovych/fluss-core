import { tap } from '../src';

describe('tap', () => {
  it('should not change value', () => {
    const value = 5;

    expect(tap((_number: number) => {})(value)).toBe(value);
  });

  it('should not wait for end of asynchronous function', () => {
    let testVariable = '';
    const value = 5;

    const effect = (_number: number) =>
      new Promise<void>((resolve) =>
        setTimeout(() => ((testVariable = 'filled'), resolve())),
      );

    tap(effect)(value);

    expect(testVariable).toBe('');
  });
});
