import { suite } from 'uvu';
import { ok, not } from 'uvu/assert';

import { isFunction } from '../src/index.js';

const IsFunction = suite('isFunction');

IsFunction('should return true if value is function', () => {
  ok(isFunction(() => {}));
  ok(isFunction(function () {}));
  ok(isFunction(function a() {}));
});

IsFunction('should return false if value is not a function', () => {
  not(isFunction(1));
  not(isFunction(null));
  not(isFunction(''));
  not(isFunction({}));
});

IsFunction.run();
