import { is } from 'uvu/assert';
import { suite } from 'uvu';

import { identity } from '../src/index.js';

const Identity = suite('identity');

Identity('should return own parameter', () => {
  is(identity.length, 1);
  is(identity(1), 1);
  is(identity(false), false);

  const obj = {};
  is(identity(obj), obj);
});

Identity.run();
