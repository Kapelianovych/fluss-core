import { binary } from '../src';

describe('binary', () => {
  it('should take an operator and return function', () => {
    expect(typeof binary('+')).toBe('function');
  });

  it('should return add function', () => {
    expect(binary('+')(1, 2)).toBe(3);
  });

  it('should return subtract function', () => {
    expect(binary('-')(1, 2)).toBe(-1);
  });

  it('should return division function', () => {
    expect(binary('/')(2, 2)).toBe(1);
  });

  it('should return modulo division function', () => {
    expect(binary('%')(3, 2)).toBe(1);
  });

  it('should return multiplication function', () => {
    expect(binary('*')(3, 2)).toBe(6);
  });

  it('should return greater than function', () => {
    expect(binary('>')(1, 2)).toBe(false);
  });

  it('should return lower than function', () => {
    expect(binary('<')(1, 2)).toBe(true);
  });

  it('should return lower than or equal function', () => {
    expect(binary('<=')(2, 2)).toBe(true);
  });

  it('should return greater than or equal function', () => {
    expect(binary('>=')(2, 2)).toBe(true);
  });

  it('should return strict equal function', () => {
    expect(binary('===')(1, 2)).toBe(false);
  });

  it('should return equal function', () => {
    expect(binary('==')('2', 2)).toBe(true);
  });

  it('should return or function', () => {
    expect(binary('||')(false, true)).toBe(true);
  });

  it('should return and function', () => {
    expect(binary('&&')(false, true)).toBe(false);
  });

  it('should return tuple for unknown operator', () => {
    expect(binary('->')(2, 2)).toEqual([2, 2]);
  });
});
