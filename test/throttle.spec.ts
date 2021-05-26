import { throttle } from '../src';

describe('throttle', () => {
  it('should delay function execution for 2 frames', (done) => {
    const now = Date.now();
    throttle(() => {
      try {
        expect(Date.now() - now).toBeGreaterThan(30);
        done();
      } catch (error) {
        done(error);
      }
    }, 2)();
  });

  it('should delay function execution for 2 frames by default', (done) => {
    const now = Date.now();
    throttle(() => {
      try {
        expect(Date.now() - now).toBeGreaterThan(30);
        done();
      } catch (error) {
        done(error);
      }
    })();
  });

  it('should execute function with requestAnimationFrame funtion if frames number is 0', (done) => {
    globalThis.requestAnimationFrame = jest.fn(
      (callback: FrameRequestCallback) => (callback(2), 1)
    );

    throttle(() => {
      try {
        expect(globalThis.requestAnimationFrame).toBeCalledTimes(1);
        done();
      } catch (error) {
        done(error);
      }
    }, 0)();
  });

  it('should execute function with requestAnimationFrame funtion if frames number 1', (done) => {
    globalThis.requestAnimationFrame = jest.fn(
      (callback: FrameRequestCallback) => (callback(2), 1)
    );

    throttle(() => {
      try {
        expect(globalThis.requestAnimationFrame).toBeCalledTimes(1);
        done();
      } catch (error) {
        done(error);
      }
    }, 1)();
  });
});
