import { fake } from 'sinon';
import { suite } from 'uvu';
import { ok, is, not, match } from 'uvu/assert';

import { Idle, IDLE_TYPE, isIdle } from '../src/index.js';

const IdleSuite = suite('Idle');

IdleSuite('should not immediately invoke function', () => {
  const initializer = fake();

  Idle(initializer);

  not(initializer.called);
});

IdleSuite('isIdle should return true if value is idle.', () => {
  ok(isIdle(Idle(() => 1)));
  not(isIdle(8));
});

IdleSuite('should estimate inner value on invoking the extract method', () => {
  is(Idle(() => 4).extract(), 4);
});

IdleSuite('should map idle value', () => {
  not(
    Idle(() => 1)
      .map((num) => num > 7)
      .extract(),
  );
});

IdleSuite('should chain idle value', () => {
  is(
    Idle(() => 1)
      .chain((num) => Idle(() => num + 5))
      .extract(),
    6,
  );
});

IdleSuite('should apply value of one idle to another', () => {
  is(
    Idle(() => 2)
      .apply(Idle(() => (num) => Math.pow(num, 3)))
      .extract(),
    8,
  );
});

IdleSuite('should be serializable', () => {
  const res = Idle(() => 9);

  match(JSON.stringify(res), `{"type":"${IDLE_TYPE}","value":9}`);
});

IdleSuite.run();
