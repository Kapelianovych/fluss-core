import { binary, identity, isFunction, isOption, when } from '../src';

describe('when', () => {
  it('should return function if it takes condition function only', () => {
    const fn = when((num: number) => num > 5);

    expect(isFunction(fn)).toBe(true);
  });

  it('should return function if it takes condition and onTrue with onFalse functions', () => {
    const fn = when((num: number) => num > 5)((num) => num * 2, identity);

    expect(isFunction(fn)).toBe(true);
  });

  it('should return Option if when takes only onTrue function', () => {
    const fn = when((num: number) => num > 5)((num) => num * 2);

    expect(isOption(fn(4))).toBe(true);
  });

  it('should return Some(12) if when takes only onTrue function', () => {
    const fn = when((num: number) => num > 5)((num) => num * 2);

    expect(fn(6).isSome()).toBe(true);
    expect(fn(6).extract()).toBe(12);
  });

  it('should return raw value (2) if when is taken onFalse function', () => {
    const fn = when((num: number) => num > 5)((num) => num * 2, identity);

    expect(isOption(fn(2))).toBe(false);
    expect(fn(2)).toBe(2);
  });

  it('should be invoked with multiple arguments', () => {
    const fn = when(binary('>'))(binary('*'), binary('+'));

    expect(fn(1, 2)).toBe(3);
  });
});
