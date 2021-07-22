import { isEither, tryCatch } from '../src';

describe('tryCatch', () => {
  test('tryCatch function without catch function and with right case returns Either with Right state', () => {
    const safeFn = tryCatch((n) => {
      if (n === 'error') {
        throw new Error(n);
      } else {
        return 'input is not an error';
      }
    });

    expect(safeFn('4').isRight()).toBe(true);
    expect(safeFn('4').extract()).toBe('input is not an error');
  });

  test('tryCatch function without catch function and with left case returns Either with Left state', () => {
    const safeFn = tryCatch((n) => {
      if (n === 'error') {
        throw new Error(n);
      } else {
        return 'input is not an error';
      }
    });

    expect(safeFn('error').isLeft()).toBe(true);
    expect(safeFn('error').extract()).toEqual(new Error('error'));
  });

  test('tryCatch function with catch function and with right case returns result', () => {
    const text = 'input is not an error';

    const safeFn = tryCatch(
      (n) => {
        if (n === 'error') {
          throw new Error(n);
        } else {
          return text;
        }
      },
      (error) => `Error: ${error.message}`
    );

    expect(isEither(safeFn('default'))).toBe(false);
    expect(safeFn('default')).toBe(text);
  });

  test('tryCatch function with catch function and with left case returns result from catch function', () => {
    const text = 'input is not an error';

    const safeFn = tryCatch(
      (n) => {
        if (n === 'error') {
          throw new Error(n);
        } else {
          return text;
        }
      },
      (error) => `Error: ${error.message}`
    );

    expect(isEither(safeFn('error'))).toBe(false);
    expect(safeFn('error')).toEqual('Error: error');
  });
});
