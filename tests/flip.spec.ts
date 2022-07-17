import { suite } from 'uvu';
import { is, type } from 'uvu/assert';

import { flip } from '../src/index.js';

const Flip = suite('flip');

Flip('should return a function', () => {
  const f = flip(() => {});

  type(f, 'function');
});

Flip("should flip function's parameters", () => {
  const fn = (s: string, n: number) => +s + n;

  is(flip(fn)(1, '2'), 3);
});

Flip('should not change function with one parameter', () => {
  const fn = (n: number) => n;

  is(flip(fn)(1), 1);
});

Flip("should flip function's variadic parameters", () => {
  const fn = (...args: number[]) => args.reduce((a, c) => a + c, '');

  is(flip(fn)(3, 2, 1), '123');
});

Flip.run();
