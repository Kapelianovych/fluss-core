import { cancelDelay, delay, FRAME_TIME } from '../src';

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

  it('should return delay id object', () => {
    const id = delay(() => {});

    expect(id).toMatchObject({
      type: expect.any(Symbol),
      id: expect.anything(),
    });
  });

  it('should use requestAnimationFrame method when frames is set to 0', (done) => {
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
});

describe('cancelDelay', () => {
  it('should cancel delayed function execution', (done) => {
    const fn = jest.fn();

    cancelDelay(delay(fn, 2));

    setTimeout(() => {
      try {
        expect(fn).not.toBeCalled();
        done();
      } catch (error) {
        done(error);
      }
    }, 3 * FRAME_TIME);
  });
});
