import { promiseOf } from '../src';

describe('promiseOf', () => {
  test('promiseOf creates rejected promise', () => {
    expect(promiseOf(new Error())).rejects.toEqual(new Error());
  });

  test('promiseOf creates resolved promise', () => {
    expect(promiseOf(8)).resolves.toBe(8);
    expect(promiseOf(Promise.resolve(8))).resolves.toBe(8);
  });
});
