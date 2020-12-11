import { jest } from '@jest/globals';
import { done, isTask, task, fail } from '../build';

describe('Task monad', () => {
  test('isTask checks if value is Task monad.', () => {
    expect(isTask(task(console.log, console.error))).toBe(true);
  });

  test('Task define action, but does not start it.', () => {
    const defineValue = task((done, _) => setTimeout(() => done(5), 1000));

    const mokedDone = jest.fn((x) => {});

    defineValue.start(mokedDone, console.error);

    expect(mokedDone).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(mokedDone).toHaveBeenCalledTimes(1);
      expect(mokedDone).toHaveBeenCalledWith(5);
    }, 1000);
  });

  test('task can convert Promise to Task', () => {
    const promise = Promise.resolve(7);

    task(promise)
      .map((num) => num + 3)
      .map((num) => num - 4)
      .start((num) => expect(num).toBe(6));
  });

  test('done creates Task with value', () => {
    const doneTask = done(7);
    expect(isTask(doneTask)).toBe(true);
  });

  test('fail creates failed Task with error value', () => {
    const failTask = fail(new Error('message'));
    expect(isTask(failTask)).toBe(true);
  });

  test('Task can map value', () => {
    const someTask = task((done, _) => setTimeout(() => done(5), 1000));

    someTask
      .map((num) => num + 9)
      .map((num) => num - 6)
      .start((num) => expect(num).toBe(8));
  });

  test('Task can chain other tasks', () => {
    const someTask = task((done, _) => setTimeout(() => done(5), 1000));

    someTask
      .chain((num) => done(num + 7))
      .chain((num) => done(num - 2))
      .start((num) => expect(num).toBe(10));
  });

  test('Task can apply other tasks', () => {
    const someTask = task((done, _) => setTimeout(() => done(5), 1000));

    someTask.apply(done((num) => num * 2)).start((num) => expect(num).toBe(10));
  });

  test('Task can return result wrapped in Promise', async () => {
    const result = done(5).asPromise();

    expect(await result).toBe(5);
  });
});
