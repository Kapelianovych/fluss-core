import { idle, isIdle } from '../src/idle';

describe('idle', () => {
  test('should not immediately invoke function', () => {
    let v;

    idle(() => (v = 4));

    expect(v).toBeUndefined();
  });

  test('isIdle should return true if value is idle.', () => {
    expect(isIdle(idle(() => 1))).toBe(true);
    expect(isIdle(8)).toBe(false);
  });

  test('should estimate inner value on invoking the extract method', () => {
    expect(idle(() => 4).extract()).toBe(4);
  });

  test('should map idle value', () => {
    expect(
      idle(() => 1)
        .map((num) => num > 7)
        .extract()
    ).toBe(false);
  });

  test('should chain idle value', () => {
    expect(
      idle(() => 1)
        .chain((num) => idle(() => num + 5))
        .extract()
    ).toBe(6);
  });

  test('should apply value of one idle to another', () => {
    expect(
      idle(() => 2)
        .apply(idle(() => (num) => Math.pow(num, 3)))
        .extract()
    ).toBe(8);
  });
});
