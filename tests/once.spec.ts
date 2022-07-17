import { suite } from 'uvu';
import { is, ok, not } from 'uvu/assert';
import { SinonSpy, fake } from 'sinon';

import { once } from '../src/index.js';

const Once = suite('once');

let func: SinonSpy;

Once.before.each(() => void (func = fake()));

Once('without once function should be called as usual', () => {
  func();
  func();
  func();

  is(func.callCount, 3);
});

Once('should invoke function only once', () => {
  const onced = fake(once(func));

  onced();
  onced();
  onced();

  ok(onced.calledThrice);
  ok(func.calledOnce);
});

Once(
  'should invoke only after function if main function has already been called.',
  () => {
    const after = fake();
    const onced = once(func, after);

    onced();
    ok(func.calledOnce);
    not(after.called);

    onced();
    ok(func.calledOnce);
    ok(after.calledOnce);

    onced();
    ok(func.calledOnce);
    ok(after.calledTwice);
  },
);

Once(
  'if only first argument is provided then should return the same result of function',
  () => {
    const onced = once(() => 'a');
    const result = onced();
    const result1 = onced();

    is(result, 'a');
    is(result1, 'a');
  },
);

Once(
  'should return always the result of second function after second invocation',
  () => {
    const onced = once(
      () => 'f',
      () => 's',
    );

    is(onced(), 'f');
    is(onced(), 's');
    is(onced(), 's');
  },
);

Once.run();
