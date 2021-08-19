import { binary } from '../src';

describe('binary', () => {
  it('should take an operator and return function', () => {
    expect(typeof binary('+')).toBe('function');
  });

  it('should return add function', () => {
    expect(binary('+')(1, 2)).toBe(3);
    expect(binary('+')(1.1, 2.2)).toBeCloseTo(3.3);
  });

  it('should return string concat function', () => {
    expect(binary('+')('1', '2')).toBe('12');
  });

  it('should return zero on invalid add operation', () => {
    expect(binary('+')(1, NaN)).toBe(0);
    expect(binary('+')(1.5, NaN)).toBe(0);
    expect(binary('+')(1, Infinity)).toBe(0);
    expect(binary('+')(1.5, Infinity)).toBe(0);
    expect(binary('+')(Infinity, 7)).toBe(0);
    expect(binary('+')(Infinity, 3.5)).toBe(0);
  });

  it('should return subtract function', () => {
    expect(binary('-')(1, 2)).toBe(-1);
    expect(binary('-')(1.1, 2)).toBeCloseTo(-0.9);
  });

  it('should return zero on invalid subtraction operation', () => {
    expect(binary('-')(1, NaN)).toBe(0);
    expect(binary('-')(1.8, NaN)).toBe(0);
    expect(binary('-')(1, Infinity)).toBe(0);
    expect(binary('-')(1.8, Infinity)).toBe(0);
    expect(binary('-')(Infinity, 6)).toBe(0);
    expect(binary('-')(Infinity, 3.0)).toBe(0);
  });

  it('should return division function', () => {
    expect(binary('/')(2, 2)).toBe(1);
    expect(binary('/')(2.2, 2)).toBeCloseTo(1.1);
  });

  it('should return zero on invalid division operation', () => {
    expect(binary('/')(1, 0)).toBe(0);
    expect(binary('/')(1.3, 0)).toBe(0);
    expect(binary('/')(1, Infinity)).toBe(0);
    expect(binary('/')(1.3, Infinity)).toBe(0);
    expect(binary('/')(Infinity, 8)).toBe(0);
    expect(binary('/')(Infinity, 4.2)).toBe(0);
  });

  it('should return modulo division function', () => {
    expect(binary('%')(3, 2)).toBe(1);
    expect(binary('%')(3, 2.5)).toBe(0.5);
  });

  it('should return zero on invalid modulo division operation', () => {
    expect(binary('%')(1, 0)).toBe(0);
    expect(binary('%')(1.4, 0)).toBe(0);
    expect(binary('%')(1, Infinity)).toBe(0);
    expect(binary('%')(1.4, Infinity)).toBe(0);
    expect(binary('%')(Infinity, 5)).toBe(0);
    expect(binary('%')(Infinity, 8.3)).toBe(0);
  });

  it('should return multiplication function', () => {
    expect(binary('*')(3, 2)).toBe(6);
    expect(binary('*')(3.2, 2)).toBe(6.4);
  });

  it('should return zero on invalid multiplication operation', () => {
    expect(binary('*')(1, NaN)).toBe(0);
    expect(binary('*')(1.6, NaN)).toBe(0);
    expect(binary('*')(1, Infinity)).toBe(0);
    expect(binary('*')(1.6, Infinity)).toBe(0);
  });

  it('should return exponentiation function', () => {
    expect(binary('**')(3, 2)).toBe(9);
    expect(binary('**')(3.1, 2)).toBeCloseTo(9.61);
  });

  it('should return zero on invalid exponentiation operation', () => {
    expect(binary('**')(1, NaN)).toBe(0);
    expect(binary('**')(1.9, NaN)).toBe(0);
    expect(binary('**')(1, Infinity)).toBe(0);
    expect(binary('**')(1.9, Infinity)).toBe(0);
    expect(binary('**')(Infinity, 5)).toBe(0);
    expect(binary('**')(Infinity, 63.7)).toBe(0);
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
