import { compose } from '../build';

describe('compose', () => {
  test('compose function must compose two functions and return function which input equals to input parameters of last function and output - output first function.', () => {
    const composedFn = compose(
      (n) => n + '!',
      (n) => `${n} is number`
    );

    expect(composedFn(9)).toBe('9 is number!');
  });
});
