import { identity } from '../src';

describe('identity', () => {
  test('Identity function returns the same primitive value', () => {
    expect(identity(8)).toBe(8);
    expect(identity(NaN)).toBe(NaN);
    expect(identity('j')).toBe('j');
    expect(identity(true)).toBe(true);
    expect(identity(null)).toBe(null);
    expect(identity(undefined)).toBe(undefined);
  });

  test('identity function returns the same object', () => {
    expect(identity({ a: 1 })).toEqual({ a: 1 });
    expect(identity([{ a: 1 }])).toEqual([{ a: 1 }]);

    const obj = { b: 3 };
    expect(identity(obj)).toBe(obj);
  });
});
