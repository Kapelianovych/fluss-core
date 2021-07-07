import { flip } from '../src';

describe('flip', () => {
  it('should return a function', () => {
    const f = flip(() => {});

    expect(typeof f).toMatch('function');
  });

  it("should flip function's parameters", () => {
    const fn = (s: string, n: number) => +s + n;

    expect(flip(fn)(1, '2')).toBe(3);
  });

  it('should not change function with one parameter', () => {
    const fn = (n: number) => n;

    expect(flip(fn)(1)).toBe(1);
  });

  it("should flip function's variadic parameters", () => {
    const fn = (...args: number[]) => args.reduce((a, c) => a + c, '');

    expect(flip(fn)(3, 2, 1)).toMatch('123');
  });
});
