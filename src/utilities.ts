/** Gets constructor type from object type. */
export type Constructor<T> = {
  new (...args: ReadonlyArray<any>): T;
  prototype: T;
};

/** Make `P` properties of `T` partial. */
export type SomePartial<T, P extends keyof T = keyof T> = Omit<T, P> &
  Partial<Pick<T, P>>;

/** Make only `P` properties of `T` partial. */
export type StrictSomePartial<T, P extends keyof T> = Required<Omit<T, P>> &
  Partial<Pick<T, P>>;

/** Make `P` properties of `T` required. */
export type SomeRequired<T, P extends keyof T = keyof T> = Omit<T, P> &
  Required<Pick<T, P>>;

/** Make only `P` properties of `T` required. */
export type StrictSomeRequired<T, P extends keyof T> = Partial<Omit<T, P>> &
  Required<Pick<T, P>>;
