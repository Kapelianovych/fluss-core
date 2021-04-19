import { isError } from '../src/is_error';

describe('isError', () => {
  test('isError with only error value must return true', () => {
    expect(isError(new Error('message'))).toBe(true);
    expect(isError(new TypeError('message'))).toBe(true);
    expect(isError(5)).toBe(false);
  });

  test(
    'isError with error value and error constructor ' +
      'must return true if value is instance of provided constructor',
    () => {
      expect(isError(new TypeError('message'), TypeError)).toBe(true);
      expect(isError(new SyntaxError('message'), TypeError)).toBe(false);
      expect(isError(5, TypeError)).toBe(false);
    }
  );
});
