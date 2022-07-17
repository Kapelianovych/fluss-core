import { suite } from 'uvu';
import { equal, is, type } from 'uvu/assert';

import { binary } from '../src/index.js';

const Binary = suite('binary');

Binary('should take an operator and return function', () => {
  type(binary('+'), 'function');
});

Binary('should return add function', () => {
  is(binary('+')(1, 2), 3);
  is(binary('+')(1.1, 2.2).toFixed(1), '3.3');
});

Binary('should return string concat function', () => {
  is(binary('++')('1', '2'), '12');
});

Binary('should return zero on invalid add operation', () => {
  is(binary('+')(1, NaN), 0);
  is(binary('+')(1.5, NaN), 0);
  is(binary('+')(1, Infinity), 0);
  is(binary('+')(1.5, Infinity), 0);
  is(binary('+')(Infinity, 7), 0);
  is(binary('+')(Infinity, 3.5), 0);
});

Binary('should return subtract function', () => {
  is(binary('-')(1, 2), -1);
  is(binary('-')(1.1, 2).toFixed(1), '-0.9');
});

Binary('should return zero on invalid subtraction operation', () => {
  is(binary('-')(1, NaN), 0);
  is(binary('-')(1.8, NaN), 0);
  is(binary('-')(1, Infinity), 0);
  is(binary('-')(1.8, Infinity), 0);
  is(binary('-')(Infinity, 6), 0);
  is(binary('-')(Infinity, 3.0), 0);
});

Binary('should return division function', () => {
  is(binary('/')(2, 2), 1);
  is(binary('/')(2.2, 2), 1.1);
});

Binary('should return zero on invalid division operation', () => {
  is(binary('/')(1, 0), 0);
  is(binary('/')(1.3, 0), 0);
  is(binary('/')(1, Infinity), 0);
  is(binary('/')(1.3, Infinity), 0);
  is(binary('/')(Infinity, 8), 0);
  is(binary('/')(Infinity, 4.2), 0);
});

Binary('should return modulo division function', () => {
  is(binary('%')(3, 2), 1);
  is(binary('%')(3, 2.5), 0.5);
});

Binary('should return zero on invalid modulo division operation', () => {
  is(binary('%')(1, 0), 0);
  is(binary('%')(1.4, 0), 0);
  is(binary('%')(1, Infinity), 0);
  is(binary('%')(1.4, Infinity), 0);
  is(binary('%')(Infinity, 5), 0);
  is(binary('%')(Infinity, 8.3), 0);
});

Binary('should return multiplication function', () => {
  is(binary('*')(3, 2), 6);
  is(binary('*')(3.2, 2), 6.4);
});

Binary('should return zero on invalid multiplication operation', () => {
  is(binary('*')(1, NaN), 0);
  is(binary('*')(1.6, NaN), 0);
  is(binary('*')(1, Infinity), 0);
  is(binary('*')(1.6, Infinity), 0);
});

Binary('should return exponentiation function', () => {
  is(binary('**')(3, 2), 9);
  is(binary('**')(3.1, 2).toFixed(2), '9.61');
});

Binary('should return zero on invalid exponentiation operation', () => {
  is(binary('**')(1, NaN), 0);
  is(binary('**')(1.9, NaN), 0);
  is(binary('**')(1, Infinity), 0);
  is(binary('**')(1.9, Infinity), 0);
  is(binary('**')(Infinity, 5), 0);
  is(binary('**')(Infinity, 63.7), 0);
});

Binary('should return greater than function', () => {
  is(binary('>')(1, 2), false);
});

Binary('should return lower than function', () => {
  is(binary('<')(1, 2), true);
});

Binary('should return lower than or equal function', () => {
  is(binary('<=')(2, 2), true);
});

Binary('should return greater than or equal function', () => {
  is(binary('>=')(2, 2), true);
});

Binary('should return strict equal function', () => {
  is(binary('===')(1, 2), false);
});

Binary('should return equal function', () => {
  is(binary('==')('2', 2), true);
});

Binary('should return or function', () => {
  is(binary('||')(false, true), true);
});

Binary('should return and function', () => {
  is(binary('&&')(false, true), false);
});

Binary('should return tuple for unknown operator', () => {
  equal(binary('->')(2, 2), [2, 2]);
});

Binary.run();
