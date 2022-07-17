import { fake } from 'sinon';
import { suite } from 'uvu';
import { ok, not, is, type, equal } from 'uvu/assert';

import {
  Ok,
  Err,
  identity,
  isResult,
  tryExecute,
  mergeResults,
  not as invert,
} from '../src/index.js';

const Result = suite('Result module');

Result('Ok should be a function', () => {
  type(Ok, 'function');
});

Result('Ok should return an object', () => {
  type(Ok(8), 'object');
});

Result('Ok should create a Result instance in the Right state', () => {
  ok(Ok(7).isOk());
});

Result('Err should be a function', () => {
  type(Err, 'function');
});

Result('should return an object', () => {
  type(Err(4), 'object');
});

Result('should create a Result instance in the Left state', () => {
  ok(Err(7).isErr());
});

Result('.map should return a new Result instance', () => {
  const result = Ok(6);
  const otherResult = result.map((value) => value + 1);

  is.not(result, otherResult);
});

Result(".map should transform Result's value if the state is Right", () => {
  const result = Ok(6).map((value) => value + 1);

  is(result.extract(), 7);
});

Result(".map should not transform Result's value if the state is Left", () => {
  const result = Err(6).map((value) => value + 1);

  is(result.extract(identity), 6);
});

Result('.chain should return a new Result instance', () => {
  const result = Ok(6);
  const otherResult = result.chain((value) => Ok(value + 1));

  is.not(result, otherResult);
});

Result(".chain should transform Result's value if the state is Right", () => {
  const result = Ok(6).chain((value) => Ok(value + 1));

  is(result.extract(identity), 7);
});

Result(
  ".chain should not transform Result's value if the state is Left",
  () => {
    const result = Err(6).chain((value) => Ok(value + 1));

    is(result.extract(identity), 6);
  },
);

Result(
  '.chain should not cover the Result instance inside another Result',
  () => {
    const result = Ok(6).chain((value) => Ok(value + 1));

    not(isResult(result.extract(identity)));
  },
);

Result('.apply should return a new Result instance', () => {
  const result = Ok(6);
  const otherResult = result.apply(Ok((value) => value + 1));

  is.not(result, otherResult);
});

Result(
  ".apply should call the other's Result function over the current one",
  () => {
    const callback: any = fake((value: number) => value + 1);
    const result = Ok(6);
    const otherResult = result.apply(Ok(callback));

    ok(callback.called);
    is(
      otherResult.extract(() => 0),
      7,
    );
  },
);

Result('.extract should unwrap result of the Result monad', () => {
  const result = Ok(8);

  is(result.extract(identity), 8);
});

Result(
  '.extract should execute the parameter callback if the Result is in the Left state',
  () => {
    const callback: any = fake(identity);
    const result = Err('error');

    is(result.extract(callback), 'error');
    ok(callback.called);
  },
);

Result(
  '.extract should return the error value if the Result is in the Left state and the defaultValue parameter is omitted',
  () => {
    const result = Err('error_value');

    is(result.extract(), 'error_value');
  },
);

Result('isResult should detect Result instances', () => {
  ok(isResult(Ok(1)));
  not(isResult(2));
  not(isResult([]));
  not(isResult({}));
});

Result(
  'mergeResults should merge an array of Results into the Result with an array of values',
  () => {
    const result = mergeResults(Ok(1), Ok(2), Ok(3));

    ok(Array.isArray(result.extract(() => [0, 0, 0])));
    ok(result.extract(() => [0, 0, 0]).every(invert(isResult)));
  },
);

Result('mergeResults should return the first failed value', () => {
  const result = mergeResults(Ok(1), Err<number, any>(2), Ok(3));

  ok(result.isErr());
  is(result.extract(), 2);
});

Result(
  'tryExecute should return Ok instance if a function runs successfully',
  () => {
    const result = tryExecute(() => 8);

    ok(result.isOk());
    is(result.extract(), 8);
  },
);

Result('tryExecute should return Err if a function throws', () => {
  const result = tryExecute(() => {
    throw new Error('error');
  });

  ok(result.isErr());
  equal(result.extract(), new Error('error'));
});

Result.run();
