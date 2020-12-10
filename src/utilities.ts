/** Gets constructor type from object type. */
export type Constructor<T> = {
  new (...args: ReadonlyArray<unknown>): T;
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

// Some types are inspired by
// [this article](https://www.freecodecamp.org/news/typescript-curry-ramda-types-f747e99744ab/)
/** Return tail elements of A except of X. */
export type Rest<
  A extends ReadonlyArray<unknown>,
  X extends Partial<A>
> = Shift<Cast<Length<X>, number>, A>;

/** Get length of array. */
export type Length<T extends ReadonlyArray<unknown>> = T['length'];

/** Get rid of first `Index` elements from `From` array. */
export type Shift<
  Index extends number = 0,
  From extends ReadonlyArray<unknown> = [],
  I extends ReadonlyArray<unknown> = []
> = Length<I> extends Index ? From : Shift<Index, Tail<From>, [From[0], ...I]>;

/** Cast X type to Y. */
export type Cast<X, Y> = X extends Y ? X : Y;

/** Get types of elements `T` except of first one. */
export type Tail<T extends ReadonlyArray<unknown>> = T extends [
  unknown,
  ...infer U
]
  ? U
  : [];

/** Get type of last element of `T`. */
export type Last<T extends ReadonlyArray<unknown>> = T[Length<Tail<T>>];
