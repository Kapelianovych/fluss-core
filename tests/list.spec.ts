import { suite } from 'uvu';
import { equal, is, ok, not, type, match } from 'uvu/assert';

import { List, isList, iterate, isOption, LIST_TYPE } from '../src/index.js';

const ListSuite = suite('List module');

ListSuite('list and iterate functions create the List container', () => {
  type(List(8), 'object');
  type(
    iterate(function* () {}),
    'object',
  );
});

ListSuite('isList checks if value is the List container.', () => {
  ok(isList(List(8)));
  ok(isList(iterate(function* () {})));
});

ListSuite('collect method returns Array representation of List', () => {
  equal(List(8).collect(), [8]);
});

ListSuite('map method transforms all values of List', () => {
  equal(
    List(1, 2, 3)
      .map((num) => num * 2)
      .collect(),
    [2, 4, 6],
  );
});

ListSuite(
  'List evaluates lazily and on calling terminal methods (size, forEach, has, some, every, isEmpty etc)',
  () => {
    let o = { a: 1 };

    const listObject = List(o).map((obj) => {
      obj.a = 2;
      return obj;
    });

    is(o.a, 1);
    listObject.size();
    is(o.a, 2);
  },
);

ListSuite('chain method converts values to List and flatten result', () => {
  equal(List(1, 2, 3).chain(List).collect(), [1, 2, 3]);
});

ListSuite('concat method joins this list with another one', () => {
  equal(List(0).concat(List(1)).collect(), [0, 1]);
});

ListSuite('filter skip values that do not pass predicate function', () => {
  equal(
    List(1, 2, 3, 4, 5, 6)
      .filter((num) => num > 3)
      .collect(),
    [4, 5, 6],
  );
});

ListSuite('prepend method add values to list', () => {
  equal(List(4).prepend(List(1, 2, 3)).collect(), [1, 2, 3, 4]);
});

ListSuite(
  'forEach method execute function for each value of List ' +
    'and does not return value',
  () => {
    let array: number[] = [];

    not(List(1, 2, 3).forEach(array.push.bind(array)));

    equal(array, [1, 2, 3]);
  },
);

ListSuite('size method returns length of List', () => {
  is(List(1, 2, 3).size(), 3);
});

ListSuite('isEmpty method checks if List has no values', () => {
  not(List(1, 2, 3).isEmpty());
  ok(List().isEmpty());
});

ListSuite('fold method reduce values of List to one value', () => {
  is(
    List(1, 2, 3).fold(
      (accumulator: number = 0, current: number = 0): number =>
        accumulator + current,
    ),
    6,
  );
});

ListSuite('fold method must return accumulator value if list is empty', () => {
  is(
    List<number>().fold(
      (accumulator: number = 0, current: number = 0): number =>
        accumulator + current,
    ),
    0,
  );
});

ListSuite('any method check if at least one value pass predicate', () => {
  ok(List(1, 2, 3).any((num) => num === 2));
  not(List(1, 2, 3).any((num) => num === 9));
  not(List().any((num) => num === 9));
});

ListSuite('all method checks if all values pass predicate', () => {
  ok(List(1, 2, 3).all((num) => num > 0));
  not(List(1, 2, 3).all((num) => num < 0));
  ok(List<number>().all((num) => num > 0));
});

ListSuite('sort method sorts list of numbers in ascending order', () => {
  equal(
    List(1, 2, 3)
      .sort((f, s) => f - s)
      .collect(),
    [1, 2, 3],
  );
  equal(
    List(5, 2, 3)
      .sort((f, s) => f - s)
      .collect(),
    [2, 3, 5],
  );
});

ListSuite('take method returns empty List if parent has not values', () => {
  equal(List().take(1).collect(), []);
});

ListSuite('take method take first 3 items from list', () => {
  equal(List(1, 2, 3, 4, 5).take(3).collect(), [1, 2, 3]);
});

ListSuite('skip method should skip 3 values', () => {
  equal(List(1, 3, 4, 5, 6).skip(3).collect(), [5, 6]);
});

ListSuite('find method returns Maybe and gets value from List', () => {
  ok(isOption(List(1).find((item) => item === 1)));
  is(
    List(1)
      .find((item) => item === 1)
      .extract(() => 0),
    1,
  );
});

ListSuite('should be serializable and return information about self', () => {
  const serializedObject = JSON.stringify(List(1, 2, 3));
  match(serializedObject, `{"type":"${LIST_TYPE}","value":[1,2,3]}`);
});

ListSuite('should take values until predicate is truthy', () => {
  const a = List(1, 2, 3, 4, 5, 6, 7, 8, 9);

  const result = a.take((item) => item < 6);
  equal(result.collect(), [1, 2, 3, 4, 5]);
});

ListSuite(
  'should skip values until it reaches `true` for a given predicate',
  () => {
    const a = List(1, 2, 3, 4, 5, 6, 7, 8, 9);

    const result = a.skip((item) => item > 6);
    equal(result.collect(), [1, 2, 3, 4, 5, 6]);
  },
);

ListSuite.run();
