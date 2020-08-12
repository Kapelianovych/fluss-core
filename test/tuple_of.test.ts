import { tupleOf } from '../src';

describe('tupleOf', () => {
  test('tupleOf creates tuple of set of values', () => {
    expect(Array.isArray(tupleOf(8, 'number'))).toBe(true);
    expect(tupleOf(8, 'number').length).toBe(2);
    expect(typeof tupleOf(8, 'number')[0]).toBe('number');
    expect(typeof tupleOf(8, 'number')[1]).toBe('string');
  });
});
