import { entries } from '../src';

describe('entries', () => {
  test('entries gets key-value pairs from object', () => {
    const entrs = entries({ a: 1, b: 2, c: 3 });

    expect(entrs).toBeInstanceOf(Array);
    expect(entrs).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });

  test('entries gets key-value pairs from array', () => {
    const entrs = entries([1, 2, 3]);

    expect(entrs).toBeInstanceOf(Array);
    expect(entrs).toEqual([
      ['0', 1],
      ['1', 2],
      ['2', 3],
    ]);
  });

  test('entries gets key-value pairs from Set', () => {
    const entrs = entries(new Set([1, 2, 3]));

    expect(entrs).toBeInstanceOf(Array);
    expect(entrs).toEqual([
      ['1', 1],
      ['2', 2],
      ['3', 3],
    ]);
  });
});
