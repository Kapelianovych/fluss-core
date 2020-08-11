import { alternation } from '../src';

describe('alternation', () => {
  test('alternation function must return result of first function if it is not null, undefined or NaN', () => {
    expect(
      alternation(
        () => 'g',
        () => 'f'
      )()
    ).toBe('g');
  });
  
  test('alternation function must return result of second function if result of first is null, undefined or NaN', () => {
    expect(
      alternation(
        () => null,
        () => 'f'
      )()
    ).toBe('f');
  });

  test('alternation function must return result of last function if result of all is null, undefined or NaN', () => {
    expect(
      alternation(
        () => null,
        () => null
      )()
    ).toBe(null);
  });
});
