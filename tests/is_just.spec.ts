import { suite } from 'uvu';
import { ok, not } from 'uvu/assert';

import { isJust } from '../src/index.js';

const IsJust = suite('isJust');

IsJust('isJust function checks if value is not null and undefined', () => {
  ok(isJust(8));
  ok(isJust('8'));
  ok(isJust(false));
  ok(isJust({}));
  not(isJust(null));
  not(isJust(undefined));
});

IsJust.run();
