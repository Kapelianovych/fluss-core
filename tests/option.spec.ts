import { suite } from 'uvu';
import { is, match, not, ok } from 'uvu/assert';

import { isOption, OPTION_TYPE, None, Some } from '../src/index.js';

const OptionSuite = suite('Option');

OptionSuite('isOption checks if value is instance of Option', () => {
  ok(isOption(None));
  ok(isOption(Some(9)));
});

OptionSuite('None object is Option with None state', () => {
  ok(None.isNone());
});

OptionSuite('Some function creates Option with Some state', () => {
  ok(Some(8).isSome());
  not(Some(null).isSome());
});

OptionSuite('extract method return inner value of Option', () => {
  is(
    Some(8).extract(() => 0),
    8,
  );
  is(
    None.extract(() => 'default'),
    'default',
  );
});

OptionSuite(
  'map method of Option invokes only if Option has Some state',
  () => {
    const result = None.map((u) => u * u).extract(() => 0);

    is(result, 0);

    const result2 = Some(2)
      .map((u) => u * u)
      .extract(() => 0);

    is(result2, 4);
  },
);

OptionSuite(
  'apply method of Option invokes only if this Option and other has Some state',
  () => {
    const result = None.apply(Some((u) => u * u)).extract(() => 0);

    is(result, 0);

    const result2 = Some(2)
      .apply(Some((u: number) => u * u))
      .extract(() => 0);

    is(result2, 4);
  },
);

OptionSuite(
  'chain method of Option invokes only if Option has Some state',
  () => {
    const result = None.chain((u) => Some(u * u)).extract(() => 0);

    is(result, 0);

    const result2 = Some(2)
      .chain((u) => Some(u * u))
      .extract(() => 0);

    is(result2, 4);
  },
);

OptionSuite('should be serializable', () => {
  const s1 = JSON.stringify(Some(1));
  const s2 = JSON.stringify(None);

  match(s1, `{"type":"${OPTION_TYPE}","value":1}`);

  match(s2, `{"type":"${OPTION_TYPE}","value":null}`);
});

OptionSuite.run();
