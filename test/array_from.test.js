import { arrayFrom } from '../build';

describe('arrayFrom', () => {
  test('arrayFrom creates an array from iterables', () => {
    expect(typeof arrayFrom([9], new Set([6]), { 0: 6, length: 1 })).toBe(
      'object'
    );
    expect(
      Array.isArray(arrayFrom([9], new Set([6]), { 0: 6, length: 1 }))
    ).toBe(true);
    expect(arrayFrom([9], new Set([6]), { 0: 6, length: 1 })).toEqual([
      9,
      6,
      6,
    ]);
  });
});
