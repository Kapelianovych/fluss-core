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

/** Get rid of first `Index` elements from a `From` array. */
export type Shift<
  Index extends number = 0,
  From extends ReadonlyArray<unknown> = [],
  I extends ReadonlyArray<unknown> = []
> = Length<I> extends Index
  ? From
  : Shift<Index, Tail<From>, [First<From>, ...I]>;

/** Get rid of last `Index` elements from a `From` array. */
export type Pop<
  Index extends number = 0,
  From extends ReadonlyArray<unknown> = [],
  I extends ReadonlyArray<unknown> = []
> = Length<I> extends Index ? From : Pop<Index, Head<From>, [Last<From>, ...I]>;

/** Cast `X` type to `Y` if `X` is not subtype of `Y`. */
export type Cast<X, Y> = X extends Y ? X : Y;

/** Get types of `T` elements except of first one. */
export type Tail<T extends ReadonlyArray<unknown>> = T extends [
  unknown,
  ...infer U
]
  ? U
  : [];

/** Get types of `T` elements except of last one. */
export type Head<T extends ReadonlyArray<unknown>> = T extends [
  ...infer U,
  unknown
]
  ? U
  : [];

/** Get type of last element of `T`. */
export type Last<T extends ReadonlyArray<unknown>> = T[Length<Tail<T>>];

/** Get type of first element of `T`. */
export type First<T extends ReadonlyArray<unknown>> = T[0];

/** Checks if type `T` has `null` or `undefined` types. */
export type HasNothing<T> = Extract<T, Nothing> extends never ? false : true;

/** Same as `NonNullable` utility type, but also excludes _void_. */
export type Just<T> = T extends Nothing ? never : T;

/** Union of empty values. */
export type Nothing = void | null | undefined;

/**
 * Represents addition to type in order to
 * make type a nominal. That interface
 * does not give a value and at runtime branded
 * values have zero cost.
 *
 * [See TypeScript core team description](https://github.com/microsoft/TypeScript/blob/3b2c48f3cdfb441ce80eaac77400cdaa7a8d0c11/src/compiler/types.ts#L1667).
 */
interface Branding<I> {
  _typeBrand: I;
}

/**
 * Create nominal type of _T_ based on unique _I_ type.
 *
 * As opposed to `Brand` type allows unbranded values to be
 * implicitly converted into the branded type, but doesn't
 * allow implicit conversion between branded types.
 *
 * [Info about `Flavor` type](https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/).
 */
export type Flavor<T, I> = T & Partial<Branding<I>>;

/**
 * Create strict nominal type of _T_ based on unique _I_ type.
 *
 * Do not allow unbranded types to be implicitly converted
 * to branded types.
 *
 * [Info about `Brand` type](https://basarat.gitbook.io/typescript/main-1/nominaltyping).
 */
export type Brand<T, I> = T & Branding<I>;

/** Make type and its inner properties (any deep level) readonly. */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/** Transform type of item in `T` array with position `P` to `R`. */
export type Transform<
  P extends number,
  R,
  T extends ReadonlyArray<unknown>,
  A extends ReadonlyArray<unknown> = []
> = Length<T> extends 0
  ? A
  : Length<A> extends P
  ? Transform<P, R, Tail<T>, [...A, R]>
  : Transform<P, R, Tail<T>, [...A, First<T>]>;

/** Get position of `V` element from `T` array. */
export type Position<
  V,
  T extends ReadonlyArray<unknown>,
  A extends ReadonlyArray<unknown> = []
> = Length<T> extends Length<A>
  ? -1
  : V extends T[Length<A>]
  ? Length<A>
  : Position<V, T, [...A, unknown]>;

/** Widen `T` to `W` if `T` is subtype of `W`. */
export type Widen<T, W = never> = T extends W ? W : T;

/** Detects if array has at least one `Promise`. */
export type HasPromise<
  R extends ReadonlyArray<unknown>,
  A extends boolean = false
> = A extends true
  ? A
  : Length<R> extends 0
  ? A
  : HasPromise<Tail<R>, First<R> extends Promise<unknown> ? true : false>;

/** Converts array of function into array with their return types. */
export type ReturnTypesOf<
  F extends ReadonlyArray<(...args: ReadonlyArray<unknown>) => unknown>,
  R extends ReadonlyArray<unknown> = []
> = Length<F> extends 0
  ? R
  : ReturnTypesOf<Tail<F>, [...R, ReturnType<First<F>>]>;
