import { fork } from '../build';

describe('fork', () => {
  test('fork function join result of functions with same input into one value', () => {
    const forkedFn = fork(
      (n, h) => n + h,
      (b) => (parseInt(b) > 5 ? parseInt(b) : 0),
      (u) => (parseInt(u) < 5 ? parseInt(u) : 0)
    );

    expect(forkedFn('4')).toBe(4);
  });

  test('functions in fork function except "join" accepts same input', () => {
    const forkedFn = fork(
      (n, h) => n + h,
      (b) => (parseInt(b) === 5 ? parseInt(b) : 0),
      (u) => (parseInt(u) === 5 ? parseInt(u) : 0)
    );

    expect(forkedFn('5')).toBe(10);
  });
});
