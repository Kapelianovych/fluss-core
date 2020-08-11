import { tap } from '../src';

describe('tap', () => {
  test('tap function returns primitive value without changes', () => {
    function changeValue<T>(value: T) {
      return `${value}`;
    }

    expect(tap(8, changeValue)).toBe(8);
    expect(tap(NaN, changeValue)).toBe(NaN);
    expect(tap('j', changeValue)).toBe('j');
    expect(tap(true, changeValue)).toBe(true);
    expect(tap(null, changeValue)).toBe(null);
    expect(tap(undefined, changeValue)).toBe(undefined);
  });

  test('tap function returns objects without changes', () => {
    function changeObject<T>(value: T) {
      return { ...value, nt: true };
    }

    expect(tap({}, changeObject)).toEqual({});
    expect(tap({ j: '5' }, changeObject)).toEqual({ j: '5' });
    const objByReference = { h: ['h'] };
    expect(tap(objByReference, changeObject)).toBe(objByReference);
  });
});
