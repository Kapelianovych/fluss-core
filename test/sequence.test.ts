import { sequence } from '../src';

describe('sequence', () => {
  test('sequence function executes functions with same input value', () => {
    let stringValue = '';
    const concatNumberAsString = sequence(
      (n: number) => (stringValue += n),
      (b: number) => (stringValue += b),
      (u: number) => (stringValue += u)
    );
    concatNumberAsString(0);

    expect(stringValue).toBe('000');
  });
});
