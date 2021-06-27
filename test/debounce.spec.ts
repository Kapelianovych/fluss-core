import { debounce, FRAME_TIME } from '../src';

describe('debounce', () => {
  it('should not run function with interval lower than defined frame', (done) => {
    const fn = jest.fn();
    const bounced = debounce(fn, 2);

    bounced();
    bounced();
    bounced();
    bounced();
    bounced();
    bounced();

    setTimeout(() => {
      try {
        expect(fn).toBeCalledTimes(1);
        done();
      } catch (error) {
        done(error);
      }
    }, FRAME_TIME * 2 + 5);
  });

  it('should run function after interval expires', (done) => {
    const fn = jest.fn();
    const bounced = debounce(fn, 2);

    bounced();

    setTimeout(() => {
      bounced();
    }, FRAME_TIME * 2);

    setTimeout(() => {
      try {
        expect(fn).toBeCalledTimes(2);
        done();
      } catch (error) {
        done(error);
      }
    }, FRAME_TIME * 5);
  });
});
