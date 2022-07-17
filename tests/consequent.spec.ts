import { fake } from 'sinon';
import { suite } from 'uvu';
import { is, ok, not } from 'uvu/assert';

import { consequent, isOption } from '../src/index.js';

const Consequent = suite('consequent');

Consequent('should invoke function as usual', () => {
  const fn = fake();
  consequent(fn)();

  ok(fn.called);
  is(fn.callCount, 1);
});

Consequent('should not invoke function if it is running', () => {
  const fn = fake(
    () => new Promise<void>((resolve) => setTimeout(resolve, 50)),
  );

  const wrappedFunction = consequent(fn);

  wrappedFunction();
  wrappedFunction();
  wrappedFunction();

  is(fn.callCount, 1);
});

Consequent('should return undefined', () => {
  not(consequent(() => {})());
});

Consequent('should signal if function is running', () => {
  const wrappedFunction = consequent(
    () => new Promise((resolve) => setTimeout(resolve, 50)),
  );

  not(wrappedFunction.busy);

  wrappedFunction();

  ok(wrappedFunction.busy);
});

Consequent.run();
