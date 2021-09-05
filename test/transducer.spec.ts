import {
  map,
  List,
  list,
  filter,
  toList,
  isList,
  toArray,
  Foldable,
  transduce,
} from '../src';

describe('transducer', () => {
  it('should filter an array', () => {
    const result = transduce([1, 2, 3, 4, 5, 6])(toArray<string>())(
      filter<readonly string[], number>((n) => n < 5),
    );

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should map an array from number to string', () => {
    const result = transduce([1, 2, 3])(toArray<string>())(
      map<ReadonlyArray<string>, number, string>(String),
    );

    expect(result).toEqual(['1', '2', '3']);
  });

  it('should combine two operation: filter and map', () => {
    const result = transduce([1, 2, 3])(toArray<string>())(
      filter<ReadonlyArray<string>, number>((value) => value >= 2),
      map<ReadonlyArray<string>, number, string>(String),
    );

    expect(result).toEqual(['2', '3']);
  });

  it('should invoke reduce function of foldable instance only once', () => {
    const foldable: Foldable<number> = [1, 2, 3];

    const reduceSpy = jest.spyOn(foldable, 'reduce');

    transduce(foldable)(toArray<string>())(
      filter<ReadonlyArray<string>, number>((value) => value >= 2),
      map<ReadonlyArray<string>, number, string>(String),
    );

    expect(reduceSpy).toBeCalledTimes(1);
  });

  it('should reduce array of numbers to list', () => {
    const result = transduce([1, 2, 3])(toList<number>())(
      filter<List<number>, number>((value) => value >= 2),
    );

    expect(isList(result)).toBe(true);
    expect(result.asArray()).toEqual([2, 3]);
  });

  it('should invoke transducers from left to right order', () => {
    interface O {
      readonly position: number;
    }

    const result = transduce([1, 2, 3, 4])(toArray<O>())(
      filter<ReadonlyArray<O>, number>((value) => value > 2),
      map<ReadonlyArray<O>, number, O>((value) => ({ position: value })),
      map<ReadonlyArray<O>, O, O>(({ position }) => ({
        position: position ** 2,
      })),
    );

    expect(result).toEqual([{ position: 9 }, { position: 16 }]);
  });

  it('should return foldable instance with same values if no transducers were provided', () => {
    const result = transduce([1, 2, 3])(toList<string>())();

    expect(result.toJSON()).toEqual(list(1, 2, 3).toJSON());
  });
});
