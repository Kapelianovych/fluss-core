import { lazy, isLazy } from '../build/lazy.js';

describe('lazy', () => {
  const container = lazy((number) => number);

  test('should creates wrapper over function', () => {
    expect(isLazy(container)).toBe(true);
  });

  test('should map value', () => {
    const mapped = container.map((number) => Math.pow(number, 2));

    expect(mapped.result(2)).toBe(4);
  });

  test('should map value with chain method', () => {
    const chained = container.chain((number) =>
      lazy((first) => first + number + '!')
    );

    expect(chained.result(1)).toBe('2!');
  });

  test('should perform application operation', () => {
    const applied = container.apply(
      lazy((number) => (result) => number + result)
    );

    expect(applied.result(1)).toBe(2);
  });
});
