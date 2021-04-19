import { freeze } from '../src/freeze';

describe('freeze', () => {
  test('freeze makes shallow freezing of object', () => {
    const frozenObject = freeze({
      a() {
        return '';
      },
      b: {
        c(): string {
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
    // @ts-expect-error
    expect(() => (frozenObject.b.c = () => 'new')).toThrow();
  });
});
