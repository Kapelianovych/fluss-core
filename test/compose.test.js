import { compose } from '../build';

describe('compose', () => {
  test(
    'compose function must compose two functions and return function ' +
      'which input equals to input parameters of last function and output - output first function.',
    () => {
      const composedFn = compose(
        (n) => `${n} is number`,
        (n) => n + '!'
      );

      expect(composedFn(9)).toBe('9 is number!');
    }
  );

  test(
    'compose function must compose two functions and return function ' +
      ' which input equals to input parameters of last function and output - output first function.',
    () => {
      const composedFn = compose(
        (n) => `${n} is number`,
        (n) => n + '!',
        (n) => n + '!',
        (n) => n + '!'
      );

      expect(composedFn(9)).toBe('9 is number!!!');
    }
  );

  test(
    'if compose function has not arguments it must return ' +
      'array of provided arguments of composed function.',
    () => {
      const composedFn = compose();

      expect(composedFn(6, 5, 4)).toEqual([6, 5, 4]);
    }
  );
});
