import { promise } from '../build/promise';

describe('promise', () => {
  test('promise creates rejected promise', () => {
    expect(promise(new Error())).rejects.toEqual(new Error());
  });

  test('promise creates resolved promise', () => {
    expect(promise(8)).resolves.toBe(8);
    expect(promise(Promise.resolve(8))).resolves.toBe(8);
  });
});
