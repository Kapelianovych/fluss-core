import { demethodize } from '../src';

describe('demethodize', () => {
  const obj = {
    a: 1,
    g(second: number) {
      return this.a + second;
    },
  };

  it('should extract method from object', () => {
    expect(typeof demethodize(obj.g)).toBe('function');
  });

  it('should accept "this" as first parameter and then arguments to the method', () => {
    const g = demethodize(obj.g);

    expect((() => g(7, 1))()).toThrow();

    expect(g(obj, 1)).toBe(2);
  });
});
