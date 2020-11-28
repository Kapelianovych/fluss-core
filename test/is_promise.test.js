import { isPromise } from '../build';

describe('isPromise', () => {
  test('isPromise function check if value is instance of Promise', () => {
    expect(isPromise(Promise.resolve('4'))).toBe(true);
    expect(isPromise(9)).toBe(false);
    expect(isPromise('text')).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise([])).toBe(false);
  });
});
