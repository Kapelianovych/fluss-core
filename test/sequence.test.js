import { sequence } from '../build';

describe('sequence', () => {
  test('sequence function executes functions with same input value', () => {
    let stringValue = '';
    const concatNumberAsString = sequence(
      (n) => (stringValue += n),
      (b) => (stringValue += b),
      (u) => (stringValue += u)
    );
    concatNumberAsString(0);

    expect(stringValue).toBe('000');
  });
});
