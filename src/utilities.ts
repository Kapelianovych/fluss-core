/** Gets constructor type from object type. */
export type Constructor<T> = {
  new (...args: readonly any[]): T;
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

/** Cast `X` type to `Y` if `X` is not subtype of `Y`. */
export type Cast<X, Y> = X extends Y ? X : Y;

/** Checks if type `T` has `null` or `undefined` types. */
export type HasNothing<T> = Extract<T, Nothing> extends never ? false : true;

/** Same as `NonNullable` utility type, but also excludes _void_. */
export type Just<T> = T extends Nothing ? never : T;

/** Union of empty values. */
export type Nothing = void | null | undefined;

/** Widen `T` to `W` if `T` is subtype of `W`. */
export type Widen<T, W = never> = T extends W ? W : T;

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

/** Checks whether *A* and *B* evaluate to *true*. */
export type And<A, B> = A extends true
  ? B extends true
    ? true
    : false
  : false;

/** Checks whether *A* equals to *B*. */
export type Is<A, B> = A extends B ? true : false;

/** Conditional operator. */
export type If<Predicate extends boolean, A, B> = Predicate extends true
  ? A
  : B;

export interface Reducer<I, V> {
  (): I;
  (accumulator: I, current: V): I;
}

export namespace Tuple {
  /** Creates a `Tuple` type of given `Length` and `Type` type .*/
  export type New<
    A extends number,
    Type = any,
    V extends readonly any[] = [],
  > = Length<V> extends A ? V : New<A, Type, [Type, ...V]>;

  /** Transform type of item in `T` tuple with position `P` to `R`. */
  export type Map<
    T extends readonly any[],
    P extends number,
    R,
    A extends readonly any[] = [],
  > = Length<T> extends 0
    ? A
    : Length<A> extends P
    ? Map<Shift<T>, P, R, [...A, R]>
    : Map<Shift<T>, P, R, [...A, First<T>]>;

  /** Get position of `V` element from `T` array. */
  export type IndexOf<
    V,
    T extends readonly any[],
    A extends readonly any[] = [],
  > = Length<T> extends Length<A>
    ? -1
    : V extends T[Length<A>]
    ? Length<A>
    : IndexOf<V, T, [...A, any]>;

  /** Reverses a tuple. */
  export type Reverse<
    P extends readonly any[],
    R extends readonly any[] = [],
  > = number extends Length<P>
    ? P
    : Length<P> extends 0
    ? R
    : Reverse<Shift<P>, [First<P>, ...R]>;

  /** Get length of a tuple. */
  export type Length<T extends readonly any[]> = T['length'];

  /**
   * Removes the *Start* elements from the start and
   * the *End* elements from the end of a tuple.
   */
  export type Slice<
    T extends readonly any[],
    Start extends number,
    End extends number = 0,
    S extends readonly any[] = [],
    E extends readonly any[] = [],
  > = And<Is<Length<S>, Start>, Is<Length<E>, End>> extends true
    ? T
    : Is<Length<S>, Start> extends true
    ? Slice<Pop<T>, Start, End, S, [Last<T>, ...E]>
    : Slice<Shift<T>, Start, End, [First<T>, ...S], E>;

  /** Get rid of a first element from a `From` tuple. */
  export type Shift<From extends readonly any[]> = From extends [
    any,
    ...infer Rest,
  ]
    ? Rest
    : never;

  /** Get rid of a last element from a `From` tuple. */
  export type Pop<From extends readonly any[]> = From extends [
    ...infer Rest,
    any,
  ]
    ? Rest
    : never;

  /** Get type of _nth_ element of `T`. */
  export type Nth<T extends readonly any[], P extends number> = T[P];

  /** Get type of last element of `T`. */
  export type Last<T extends readonly any[]> = Nth<T, Length<Shift<T>>>;

  /** Get type of first element of `T`. */
  export type First<T extends readonly any[]> = Nth<T, 0>;

  /** Flattens tuples inside a `V` tuple. */
  export type Flat<
    V extends readonly any[],
    R extends readonly any[] = [],
  > = Length<V> extends 0 ? R : Flat<Pop<V>, [...Last<V>, ...R]>;
}

export namespace Math {
  /**
   * Creates an iterable from the count of desired
   * values.
   */
  export type Counter<A extends number> = Tuple.New<A>;

  /** Subtracts two numbers. Result cannot be lower than `0`. */
  export type Minus<F extends number, S extends number> = Tuple.Length<
    Tuple.Slice<Counter<F>, S>
  >;

  /** Adds two numbers. */
  export type Plus<F extends number, S extends number> = Tuple.Length<
    [...Counter<F>, ...Counter<S>]
  >;
}
