import { forEach } from '../src';

describe('forEach', () => {
  test('forEach function invokes function for all elements of array', () => {
    // Jest does not infer forEach generic type :(
    const mokedForEach = jest.fn(forEach);
    const mokedCallback = jest.fn((num) => {});

    mokedForEach([1, 2], mokedCallback);

    expect(mokedForEach).toBeCalledTimes(1);
    expect(mokedCallback).toBeCalledTimes(2);

    expect(mokedForEach).toHaveReturned();
    expect(mokedForEach).toHaveReturnedWith(undefined);
  });
});
