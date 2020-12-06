import { tuple } from '../build';

describe('tuple', () => {
  test('tuple creates tuple of set of values', () => {
    expect(Array.isArray(tuple(8, 'number'))).toBe(true);
    expect(tuple(8, 'number').length).toBe(2);
    expect(typeof tuple(8, 'number')[0]).toBe('number');
    expect(typeof tuple(8, 'number')[1]).toBe('string');
  });
});
