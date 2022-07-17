import { fake } from 'sinon';
import { suite } from 'uvu';
import { ok, not, type } from 'uvu/assert';

import { Stream, isStream, identity } from '../src/index.js';

const StreamSuite = suite('stream');

StreamSuite('should be a function', () => {
  type(Stream, 'function');
});

StreamSuite('should creates an object', () => {
  type(Stream(identity), 'object');
});

StreamSuite('isStream should returns true for a stream object', () => {
  ok(isStream(Stream(identity)));
  not(isStream([]));
});

StreamSuite('should notify a callback about a new value', () => {
  const callback = fake();

  const s = Stream(identity<number>);

  s.forEach(callback);

  s.send(1);

  ok(callback.called);
});

StreamSuite('should notify a stream about a new value', () => {
  const callback = fake();
  const e = Stream(identity<number>);
  const a = Stream(identity<number>);

  a.forEach(e);
  e.forEach(callback);

  a.send(1);

  ok(callback.called);
  ok(callback.calledWith(1));
});

StreamSuite('forEach method should return unsubscribe function', () => {
  const callback = fake();
  const s = Stream(identity<number>);

  const stop = s.forEach(callback);

  stop();

  s.send(1);

  not(callback.called);
});

StreamSuite('should map value', () => {
  const callback = fake();
  const s = Stream((n: number) => n + 1);

  s.forEach(callback);

  s.send(1);

  ok(callback.calledWith(2));
});

StreamSuite(
  'should filter values if at least one function returns undefined',
  () => {
    const callback = fake();
    const tap = fake(identity);

    const s = Stream((n: number) => (n > 0 ? n : undefined), tap);

    s.forEach(callback);

    s.send(1);

    ok(callback.called);

    tap.resetHistory();
    callback.resetHistory();

    s.send(0);

    not(tap.called);
    not(callback.called);
  },
);

StreamSuite.run();
