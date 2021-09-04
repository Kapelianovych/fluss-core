import { stream, isStream } from '../src';

describe('stream', () => {
  test('should creates stream object', () => {
    expect(typeof stream()).toBe('object');
  });

  test('isStream should returns true for stream object', () => {
    expect(isStream(stream())).toBe(true);
    expect(isStream([])).toBe(false);
  });

  test('should notify listener about new value', () => {
    let value: number | undefined = undefined;

    const s = stream<number>();

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
    let value: number = 0;
    const s = stream<number>();

    s.filter((value) => value > 5).listen((v) => (value = v));

    s.send(1);

    expect(value).toBe(0);

    s.send(8);

    expect(value).toBe(8);
  });

  test('derive method must create new stream', () => {
    const s = stream();

    const a = s.derive((derived) => (value) => value);

    expect(s).not.toBe(a);
  });

  test('concat method should merge this stream with another one', () => {
    let value: number = 0;

    const f = stream<number>();
    const b = stream<number>();
    const c = stream<number>();
    const d = stream<number>();

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
});
