import { delay, FRAME_TIME } from '../src';

describe('FRAME_TIME', () => {
  it('should be exported', () => {
    expect(FRAME_TIME).toBeDefined();
  });

  it('should be close to 16.67', () => {
    expect(FRAME_TIME).toBeCloseTo(16.67);
  });
});

describe('delay', () => {
  it('should not invoke function immediately', () => {
    const fn = jest.fn();

    delay(fn, 2);

    expect(fn).not.toBeCalled();
  });

  it('should invoke function after two frames', (done) => {
    const now = Date.now();

    delay(() => {
      try {
        // It is not precise test.
        expect(Date.now() - now).toBeLessThan(FRAME_TIME * 3);
        done();
      } catch (error) {
        done(error);
      }
    }, 2);
  });

  it('should return delay object', () => {
    const id = delay(() => {});

    expect(id).toMatchObject({
      result: expect.any(Promise),
      canceled: expect.any(Boolean),
      cancel: expect.any(Function),
    });
  });

  it('should use requestAnimationFrame function when frames is set to 0', (done) => {
    globalThis.requestAnimationFrame = jest.fn();

    delay(() => {}, 0);

    setTimeout(() => {
      try {
        expect(globalThis.requestAnimationFrame).toBeCalled();
        done();
      } catch (error) {
        done(error);
      }
    }, 100);
  });

  it('should use requestAnimationFrame function when frames is not defined', (done) => {
    globalThis.requestAnimationFrame = jest.fn();

    delay(() => {});

    setTimeout(() => {
      try {
        expect(globalThis.requestAnimationFrame).toBeCalled();
        done();
      } catch (error) {
        done(error);
      }
    }, 100);
  });
});

describe('cancelDelay', () => {
  it('should cancel delayed function execution', (done) => {
    const fn = jest.fn();

    delay(fn, 2).cancel();

    setTimeout(() => {
      try {
        expect(fn).not.toBeCalled();
        done();
      } catch (error) {
        done(error);
      }
    }, 3 * FRAME_TIME);
  });

  it('should signal if delay if canceled', () => {
    const stamp = delay(() => {}, 2);

    expect(stamp.canceled).toBe(false);

    stamp.cancel();

    expect(stamp.canceled).toBe(true);
  });

  it('should return result from delayed function', async () => {
    const fn = () => 7;

    const { result } = delay(fn, 2);

    expect(await result).toBe(7);
  });

  it('should not throw an error on twice cancel execution', () => {
    const stamp = delay(() => {}, 2);

    expect(stamp.cancel).not.toThrow();
    expect(stamp.cancel).not.toThrow();
    expect(stamp.cancel).not.toThrow();
  });
});
