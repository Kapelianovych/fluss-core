import { throttle } from '../src';

describe('throttle', () => {
  it('should execute function immediately by default', (done) => {
    const now = Date.now();
    throttle(() => {
      try {
        expect(Date.now() - now).toBeLessThan(1);
        done();
      } catch (error) {
        done(error);
      }
    })();
  });

  it('should block other executions that goes right after first execution', () => {
    const fakeFunction = jest.fn();

    const throttledFunction = throttle(fakeFunction, 2);

    throttledFunction();
    throttledFunction();
    throttledFunction();

    expect(fakeFunction).toBeCalledTimes(1);
  });
});
