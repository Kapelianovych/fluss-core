import { reject } from '../src';

describe('reject', () => {
  test('reject creates rejected promise', () => {
    expect(reject()).rejects.toBeFalsy();
    expect(reject(new Error())).rejects.toEqual(new Error());
  });
});
