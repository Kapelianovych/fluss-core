import { sequence } from '../src';

describe('sequence', () => {
  test('sequence function executes functions with same input value', () => {
    let stringValue = ''
    sequence(
      0,
      (n: number) => stringValue += n,
      (b: number) => stringValue += b,
      (u: number) => stringValue += u
    );

    expect(stringValue).toBe('000');
  });
});
