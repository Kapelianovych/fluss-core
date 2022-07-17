import { suite } from 'uvu';
import { ok, not } from 'uvu/assert';

import { isObject } from '../src/index.js';

const IsObject = suite('isObject');

IsObject('should return true on object value', () => {
  ok(isObject({}));
  ok(isObject([]));
  ok(isObject(new Set()));
});

IsObject('should return false on null and any other non-object value', () => {
  not(isObject(null));
  not(isObject(() => {}));
  not(isObject(1));
  not(isObject(''));
  not(isObject(false));
});

IsObject.run();
