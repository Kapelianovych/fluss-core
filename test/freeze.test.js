import { freeze } from '../build';

describe('freeze', () => {
  test('freeze makes shallow freezing of object', () => {
    const frozenObject = freeze({
      a() {
        return '';
      },
      b: {
        c() {
          return '';
        },
      },
    });

    expect(Object.isFrozen(frozenObject)).toBe(true);
    frozenObject.b.c = () => 'new string';
    expect(frozenObject.b.c()).toMatch('new string');
  });

  test('freeze makes deep freezing of object', () => {
    const frozenObject = freeze(
      {
        a() {
          return '';
        },
        b: {
          c() {
            return 'old';
          },
        },
      },
      true
    );

    expect(Object.isFrozen(frozenObject)).toBe(true);
    expect(() => (frozenObject.b.c = () => 'new')).toThrow();
  });
});
