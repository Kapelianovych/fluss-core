import { list, iterate, isList, isMaybe } from '../build';

describe('List data structure', () => {
  test('list and iterate functions create List container', () => {
    expect(typeof list(8)).toBe('object');
    expect(typeof iterate(function* () {})).toBe('object');
  });

  test('isList checks if value is List container.', () => {
    expect(isList(list(8))).toBe(true);
  });

  test('asArray method returns Array representation of List', () => {
    expect(list(8).asArray()).toEqual([8]);
  });

  test('map method transforms all values of List', () => {
    expect(
      list(1, 2, 3)
        .map((num) => num * 2)
        .asArray()
    ).toEqual([2, 4, 6]);
  });

  test('List evaluates lazily and on calling terminal methods (size, forEach, has, some, every, isEmpty etc)', () => {
    let o = { a: 1 };

    const listObject = list(o).map((obj) => {
      obj.a = 2;
      return obj;
    });

    expect(o.a).toBe(1);
    listObject.size();
    expect(o.a).toBe(2);
  });

  test('chain method converts values to List and flatten result', () => {
    expect(list(1, 2, 3).chain(list).asArray()).toEqual([1, 2, 3]);
  });

  test('join concat iterables', () => {
    expect(
      list(0)
        .join([1], new Set([2]), list(3))
        .asArray()
    ).toEqual([0, 1, 2, 3]);
  });

  test('filter skip values that do not pass predicat function', () => {
    expect(
      list(1, 2, 3, 4, 5, 6)
        .filter((num) => num > 3)
        .asArray()
    ).toEqual([4, 5, 6]);
  });

  test('append method add values to list', () => {
    expect(list(4).append(1, 2, 3).asArray()).toEqual([4, 1, 2, 3]);
  });

  test('prepend method add values to list', () => {
    expect(list(4).prepend(1, 2, 3).asArray()).toEqual([1, 2, 3, 4]);
  });

  test(
    'forEach method execute function for each value of List ' +
      'and does not return value',
    () => {
      let array = [];

      expect(list(1, 2, 3).forEach(array.push.bind(array))).toBe(undefined);

      expect(array).toEqual([1, 2, 3]);
    }
  );

  test('has method checks if value exists in List', () => {
    expect(list(1, 2, 3).has(1)).toBe(true);
    expect(list(1, 2, 3).has(9)).toBe(false);
  });

  test('size method returns length of List', () => {
    expect(list(1, 2, 3).size()).toBe(3);
  });

  test('isEmpty mehtod checks if List has no values', () => {
    expect(list(1, 2, 3).isEmpty()).toBe(false);
    expect(list().isEmpty()).toBe(true);
  });

  test('fold method reduce values of List to one value', () => {
    expect(list(1, 2, 3).fold((a, v) => a + v, 0)).toBe(6);
  });

  test('any method check if at least one value pass predicat', () => {
    expect(list(1, 2, 3).any((num) => num === 2)).toBe(true);
    expect(list(1, 2, 3).any((num) => num === 9)).toBe(false);
    expect(list().any((num) => num === 9)).toBe(false);
  });

  test('all method checks if all values pass predicat', () => {
    expect(list(1, 2, 3).all((num) => num > 0)).toBe(true);
    expect(list(1, 2, 3).all((num) => num < 0)).toBe(false);
    expect(list().all((num) => num > 0)).toBe(true);
  });

  test('sort method sorts list of numbers in ascending order', () => {
    expect(
      list(1, 2, 3)
        .sort((f, s) => f - s)
        .asArray()
    ).toEqual([1, 2, 3]);
    expect(
      list(5, 2, 3)
        .sort((f, s) => f - s)
        .asArray()
    ).toEqual([2, 3, 5]);
  });

  test('take method take first 3 items from list', () => {
    expect(list(1, 2, 3, 4, 5).take(3).asArray()).toEqual([1, 2, 3]);
  });

  test('uniqueBy skips duplicate values by id property', () => {
    expect(
      list({ id: 1 }, { id: 2 }, { id: 2 }, { id: 2 }, { id: 5 })
        .uniqueBy((item) => item.id)
        .asArray()
    ).toEqual([{ id: 1 }, { id: 2 }, { id: 5 }]);
  });

  test('uniqueBy skips values by id property of inner object', () => {
    expect(
      list(
        { o: { id: 1 } },
        { o: { id: 2 } },
        { o: { id: 2 } },
        { o: { id: 2 } },
        { o: { id: 5 } }
      )
        .uniqueBy((item) => item.o.id)
        .asArray()
    ).toEqual([{ o: { id: 1 } }, { o: { id: 2 } }, { o: { id: 5 } }]);
  });

  test('compress method should get rid of null and undefined values', () => {
    expect(list(1, null, 2, undefined, 3).compress().asArray()).toEqual([
      1,
      2,
      3,
    ]);
  });

  test('skip method should skip 3 values', () => {
    expect(list(1, 3, 4, 5, 6).skip(3).asArray()).toEqual([5, 6]);
  });

  test('find method returns Maybe and gets value from List', () => {
    expect(isMaybe(list(1).find((item) => item === 1))).toBe(true);
    expect(
      list(1)
        .find((item) => item === 1)
        .extract()
    ).toBe(1);
  });

  test('should be serializable and return information about self', () => {
    const serializabledObject = JSON.stringify(list(1, 2, 3));
    expect(serializabledObject).toMatch('"type":"List"');
    expect(serializabledObject).toMatch('"value":[1,2,3]');
  });
});
