import { suite } from 'uvu';
import { ok, not } from 'uvu/assert';

import { isError } from '../src/index.js';

const IsError = suite('isError');

IsError('isError with only error value must return true', () => {
  ok(isError(new Error('message')));
  ok(isError(new TypeError('message')));
  not(isError(5));
});

IsError(
  'isError with error value and error constructor ' +
    'must return true if value is instance of provided constructor',
  () => {
    ok(isError(new TypeError('message'), TypeError));
    ok(isError(new SyntaxError('message'), SyntaxError));
    not(isError(5, TypeError));
  },
);

IsError.run();
