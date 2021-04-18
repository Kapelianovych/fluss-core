import { sequentially } from '../build';

describe('sequentially', () => {
  test('sequentially function executes functions with same input value', () => {
    let stringValue = '';
    const concatNumberAsString = sequentially(
      (n) => (stringValue += n),
      (b) => (stringValue += b),
      (u) => (stringValue += u)
    );
    concatNumberAsString(0);

    expect(stringValue).toBe('000');
  });

  test('should be able to handle asynchronous functions and return promise', async () => {
    let text = '';
    const s = sequentially(
      async (num) => (text += num),
      (num) => (text += num + 1),
      async (num) => (text += num + 2)
    );

    const result = s(1);

    expect(result).toBeInstanceOf(Promise);

    await result;

    expect(text).toBe('123');
  });
});
