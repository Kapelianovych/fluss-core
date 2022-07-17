import { suite } from 'uvu';
import { ok, not } from 'uvu/assert';

import { isPromise } from '../src/index.js';

const IsPromise = suite('isPromise');

IsPromise('isPromise function check if value is instance of Promise', () => {
  ok(isPromise(Promise.resolve('4')));
  not(isPromise(9));
  not(isPromise('text'));
  not(isPromise({}));
  not(isPromise([]));
});

IsPromise.run();
