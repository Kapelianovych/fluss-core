import { suite } from 'uvu';
import { instance, ok } from 'uvu/assert';

import {
  ResultState,
  isList,
  isIdle,
  reviver,
  isResult,
  isOption,
  IDLE_TYPE,
  LIST_TYPE,
  OPTION_TYPE,
  RESULT_TYPE,
} from '../src/index.js';

const Reviver = suite('reviver');

Reviver('should skip values that are not Idle, Option, Result and List', () => {
  const json = '{"h":1}';
  instance(JSON.parse(json, reviver), Object);
});

Reviver('should create Option instance', () => {
  const json = `{"type":"${OPTION_TYPE}","value":1}`;
  ok(isOption(JSON.parse(json, reviver)));
});

Reviver('should create a List instance', () => {
  const json = `{"type":"${LIST_TYPE}","value":[1]}`;
  ok(isList(JSON.parse(json, reviver)));
});

Reviver('should create a Result instance', () => {
  const jsonR = `{"type":"${RESULT_TYPE}","value":{"state":"${ResultState.Ok}","value":1}}`;
  ok(isResult(JSON.parse(jsonR, reviver)));
  ok(JSON.parse(jsonR, reviver).isOk());

  const jsonL = `{"type":"${RESULT_TYPE}","value":{"state":"${ResultState.Err}","value":1}}`;
  ok(isResult(JSON.parse(jsonL, reviver)));
  ok(JSON.parse(jsonL, reviver).isErr());
});

Reviver('should create an Idle instance', () => {
  const json = `{"type":"${IDLE_TYPE}","value":7}`;
  ok(isIdle(JSON.parse(json, reviver)));
});

Reviver.run();
