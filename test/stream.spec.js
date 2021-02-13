import { stream, isStream } from '../build';

describe('stream', () => {
  test('should creates stream object', () => {
    expect(typeof stream()).toBe('object');
  });

  test('isStream should returns true for stream object', () => {
    expect(isStream(stream())).toBe(true);
    expect(isStream([])).toBe(false);
  });

  test('should notify listener about new value', () => {
    let value;

    const s = stream();

    s.listen((v) => (value = v));

    expect(value).toBeUndefined();

    s.send(1);

    expect(value).toBe(1);
  });

  test('listen method should return unsubscribe function', () => {
    let value;
    const s = stream();

    const stop = s.listen((v) => (value = v));

    expect(value).toBeUndefined();

    stop();

    s.send(1);

    expect(value).toBeUndefined();
  });

  test('should maps value', () => {
    let value;
    const s = stream();

    s.map((value) => value + '!').listen((v) => (value = v));

    s.send(1);

    expect(value).toMatch('1!');
  });

  test('should filter values', () => {
    let value;
    const s = stream();

    s.filter((value) => value > 5).listen((v) => (value = v));

    s.send(1);

    expect(value).toBeUndefined();

    s.send(8);

    expect(value).toBe(8);
  });

  test('derive method must create new stream', () => {
    const s = stream();

    const a = s.derive((derived) => (value) => value);

    expect(s).not.toBe(a);
  });

  test('should destroy listeners and stream must not respond to new values', () => {
    let value;
    const s = stream();
    s.listen((v) => (value = v));

    s.destroy();

    s.send(5);

    expect(value).toBeUndefined();
  });

  test('should invoke onDestroyed before self destroying', () => {
    let value;
    const s = stream().onDestroy(() => (value = 'destroyed'));

    s.destroy();

    expect(value).toMatch('destroyed');
  });

  test('freeze method should stop accepting new value', () => {
    let value;
    const s = stream();
    s.listen((v) => (value = v));

    s.freeze();

    s.send(1);

    expect(value).toBeUndefined();
  });

  test('resume should allow stream to pass new values', () => {
    let value;
    const s = stream();
    s.listen((v) => (value = v));

    s.freeze();

    s.resume();

    s.send(1);

    expect(value).toBe(1);
  });
});
