import { identity } from '../src';

describe('identity', () => {
  it('should return own parameter', () => {
    expect(identity.length).toBe(1);
    expect(identity(1)).toBe(1);
    expect(identity(false)).toBe(false);

    const obj = {};
    expect(identity(obj)).toBe(obj);
  });
});
