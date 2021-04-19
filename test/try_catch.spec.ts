import { tryCatch } from '../src/try_catch';

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

  test('tryCatch function with catch function and with right case returns Either with Right state', () => {
    const safeFn = tryCatch(
      (n) => {
        if (n === 'error') {
          throw new Error(n);
        } else {
          return 'input is not an error';
        }
      },
      (error) => `Error: ${error.message}`
    );

    expect(safeFn('default').isRight()).toBe(true);
    expect(safeFn('default').extract()).toBe('input is not an error');
  });

  test('tryCatch function with catch function and with left case returns Either with Right state', () => {
    const safeFn = tryCatch(
      (n) => {
        if (n === 'error') {
          throw new Error(n);
        } else {
          return 'input is not an error';
        }
      },
      (error) => `Error: ${error.message}`
    );

    expect(safeFn('error').isLeft()).toBe(false);
    expect(safeFn('error').extract()).toEqual('Error: error');
  });
});
