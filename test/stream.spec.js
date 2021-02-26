import { stream, isStream, StreamEvent } from '../build';

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

  test('should invoke destroyed listener before self destroying', () => {
    let value;
    const s = stream();

    s.on(StreamEvent.DESTROY, () => (value = 'destroyed'));

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

  test('should invoke frozen listener before self freezing', () => {
    let value;
    const s = stream();

    s.on(StreamEvent.FREEZE, () => (value = 'frozen'));

    s.freeze();

    expect(value).toMatch('frozen');
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

  test('should invoke resumed listener before self resume', () => {
    let value;
    const s = stream();

    s.on(StreamEvent.RESUME, () => (value = 'resumed'));

    s.freeze();
    s.resume();

    expect(value).toMatch('resumed');
  });

  test('concat method should merge this stream with another one', () => {
    let value;

    const f = stream();
    const b = stream();
    const c = stream();
    const d = stream();

    const n = f.concat(b).concat(c).concat(d);

    n.listen((v) => (value = v));

    f.send(1);
    expect(value).toBe(1);

    b.send(2);
    expect(value).toBe(2);

    c.send(3);
    expect(value).toBe(3);

    d.send(4);
    expect(value).toBe(4);
  });

  test('uniqueBy method should filter values that sream already passed on', () => {
    let value;
    const s = stream();

    s.uniqueBy((value) => value).listen((v) => (value = v));

    s.send(1);
    expect(value).toBe(1);
    s.send(2);
    s.send(1);
    expect(value).toBe(2);
  });

  test('compress method should filter null and undefined values', () => {
    let value = 1;
    const s = stream();

    s.compress().listen((v) => (value = v));

    s.send(null);
    expect(value).toBe(1);

    s.send(undefined);
    expect(value).toBe(1);
  });
});
