import { demethodize } from '../src';

describe('demethodize', () => {
  const obj = {
    a: 1,
    g(second: number) {
      return this.a + second;
    },
  };

  it('should extract method from object', () => {
    expect(typeof demethodize(obj, 'g')).toBe('function');
  });

  it('should properly execute function', () => {
    const g = demethodize(obj, 'g');

    expect(() => g(4)).not.toThrow();
    expect(g(1)).toBe(2);
  });
});
