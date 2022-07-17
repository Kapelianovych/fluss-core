import { fake } from 'sinon';
import { suite } from 'uvu';
import { ok, is, type, unreachable, not } from 'uvu/assert';

import {
  Fail,
  Task,
  isTask,
  Succeed,
  isResult,
  identity,
  isPromise,
  mergeTasks,
  ForkFunction,
} from '../src/index.js';

const TaskSuite = suite('Task module');

TaskSuite('should be a function', () => {
  type(Task, 'function');
});

TaskSuite('should return an object', () => {
  type(
    Task(() => {}),
    'object',
  );
});

TaskSuite('should accept an executor function as the argument', async () => {
  const task = Task((success, _fail) => success(2));

  try {
    const result = await task.run();
    ok(result);
  } catch (e) {
    unreachable();
  }
});

TaskSuite('should accept a Promise as the argument', async () => {
  const task = Task(Promise.resolve());

  try {
    const result = await task.run();
    ok(result);
  } catch (e) {
    unreachable();
  }
});

TaskSuite('should accept another Task as the argument', async () => {
  const task = Task(Task((success, _fail) => success(2)));

  try {
    const result = await task.run();
    ok(result);
  } catch (e) {
    unreachable();
  }
});

TaskSuite('should not execute a parameter immediately', () => {
  const executor = fake((success, _fail) => success());

  Task(executor);

  ok(!executor.called);
});

TaskSuite('should execute a Task and return the Result monad', async () => {
  const executor = fake((success, fail) =>
    Math.random() > 0.45 ? success() : fail(),
  );
  const task = Task(executor);

  const result = task.run();

  ok(isPromise(result));
  ok(isResult(await result));
  ok(executor.called);
});

TaskSuite('should not return rejected Promise if the Task fails', async () => {
  const task = Task((_, fail) => fail(''));

  try {
    const result = await task.run();
    ok(result);
  } catch (e) {
    unreachable();
  }
});

TaskSuite('should not invoke a callback immediately', () => {
  const callback = fake((value) => value + 1);

  Task((success, _fail) => success(6)).map(callback);

  ok(!callback.called);
});

TaskSuite('should return a new Task instance', () => {
  const task = Task<number, unknown>((success, _fail) => success(6));
  const otherTask = task.map((value) => value + 1);

  is.not(task, otherTask);
});

TaskSuite("should transform Task's value", async () => {
  const result = await Task<number, unknown>((success, _fail) => success(6))
    .map((value) => value + 1)
    .run();

  is(
    result.extract(() => 0),
    7,
  );
});

TaskSuite('should not invoke a callback immediately', () => {
  const callback = fake((value) =>
    Task((success, _fail) => success(value + 1)),
  );

  Task((success, _fail) => success(6)).chain(callback);

  ok(!callback.called);
});

TaskSuite('should return a new Task instance', () => {
  const task = Task<number, unknown>((success, _fail) => success(6));
  const otherTask = task.chain((value) =>
    Task((success, _fail) => success(value + 1)),
  );

  is.not(task, otherTask);
});

TaskSuite(
  'should not cover the Task instance inside another Task',
  async () => {
    const result = await Task<number, unknown>((success, _fail) => success(6))
      .chain((value) => Task((success, _fail) => success(value + 1)))
      .run();

    ok(isResult(result));
  },
);

TaskSuite("should transform Task's value", async () => {
  const result = await Task<number, unknown>((success, _fail) => success(6))
    .chain((value) => Task((success, _fail) => success(value + 1)))
    .run();

  is(
    result.extract(() => 0),
    7,
  );
});

TaskSuite('should not invoke a callback immediately', () => {
  const callback = fake((value) => value + 1);

  const other = Task<(value: number) => unknown, unknown>((success, _fail) =>
    success(callback),
  );

  Task<number, unknown>((success, _fail) => success(6)).apply(other);

  ok(!callback.called);
});

TaskSuite('should return a new Task instance', () => {
  const task = Task<number, unknown>((success, _fail) => success(6));
  const otherTask = task.apply(
    Task<(n: number) => unknown, unknown>((success, _fail) =>
      success((value) => value + 1),
    ),
  );

  is.not(task, otherTask);
});

TaskSuite(
  "should call the other's Task function over the result of the current one",
  async () => {
    const callback = fake((value) => value + 1);
    const task = Task<number, unknown>((success, _fail) => success(6));
    const result = await task
      .apply(
        Task<(n: number) => unknown, unknown>((success, _fail) =>
          success(callback),
        ),
      )
      .run();

    ok(callback.called);
    is(
      result.extract(() => 0),
      7,
    );
  },
);

TaskSuite('Succeed should create a succeeded Task with a value', async () => {
  const fn: ForkFunction<null, unknown> = (success, _fail) => success(null);
  const task = Succeed(fn);

  is(
    (await task.run()).extract(() => () => {}),
    fn,
  );
});

TaskSuite('Fail should create a failed Task with a value', async () => {
  const fn: ForkFunction<void, unknown> = (success, _fail) => success();
  const task = Fail(fn);

  const getDefaultValue = fake((_n: Function) => null);

  is((await task.run()).extract(getDefaultValue), null);
  ok(getDefaultValue.called);
  ok(getDefaultValue.calledWith(fn));
});

TaskSuite('should detect Task instances', () => {
  ok(isTask(Task<void, unknown>((success, _fail) => success())));
  not(isTask(2));
  not(isTask([]));
  not(isTask({}));
});

TaskSuite(
  'should merge an array of Tasks into the Task with an array of results',
  async () => {
    const result = await mergeTasks(Succeed(1), Succeed(2), Succeed(3)).run();

    ok(Array.isArray(result.extract()));
    ok(result.extract().every(isResult));
  },
);

TaskSuite(
  'should return all results even if there are failed ones',
  async () => {
    const result = await mergeTasks(Succeed(1), Fail(2), Succeed(3)).run();

    ok(result.isOk());
    ok(Array.isArray(result.extract(identity)));
    is(result.extract(identity)[1].extract(identity), 2);
  },
);

TaskSuite.run();
