import { suite } from 'uvu';
import { is, type } from 'uvu/assert';

import { not } from '../src/index.js';

const Not = suite('not');

Not('should return the boolean value', () => {
  type(not(() => false)(), 'boolean');
});

Not("should invert the callback's result", () => {
  is(not(() => true)(), false);
});

Not.run();
