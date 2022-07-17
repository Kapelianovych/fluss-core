import { suite } from 'uvu';
import { is, not, ok } from 'uvu/assert';

import { binary, identity, isFunction, isOption, when } from '../src/index.js';

const When = suite('when');

When('should return function if it takes condition function only', () => {
  const fn = when((num: number) => num > 5);

  ok(isFunction(fn));
});

When(
  'should return function if it takes condition and onTrue with onFalse functions',
  () => {
    const fn = when((num: number) => num > 5)((num) => num * 2, identity);

    ok(isFunction(fn));
  },
);

When('should return Option if when takes only onTrue function', () => {
  const fn = when((num: number) => num > 5)((num) => num * 2);

  ok(isOption(fn(4)));
});

When('should return Some(12) if when takes only onTrue function', () => {
  const fn = when((num: number) => num > 5)((num) => num * 2);

  ok(fn(6).isSome());
  is(
    fn(6).extract(() => 0),
    12,
  );
});

When('should return raw value (2) if when is taken onFalse function', () => {
  const fn = when((num: number) => num > 5)((num) => num * 2, identity);

  not(isOption(fn(2)));
  is(fn(2), 2);
});

When('should be invoked with multiple arguments', () => {
  const fn = when(binary('>'))(binary('*'), binary('+'));

  is(fn(1, 2), 3);
});

When.run();
