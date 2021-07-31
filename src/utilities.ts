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

export namespace NArray {
  /** Creates an `Array` with `Length` and given `Type`.*/
  export type Create<
    A extends number,
    Type = any,
    V extends ReadonlyArray<any> = [],
  > = Length<V> extends A ? V : Create<A, Type, [Type, ...V]>;

  /** Transform type of item in `T` array with position `P` to `R`. */
  export type Transform<
    P extends number,
    R,
    T extends ReadonlyArray<any>,
    A extends ReadonlyArray<any> = [],
  > = Length<T> extends 0
    ? A
    : Length<A> extends P
    ? Transform<P, R, Tail<T>, [...A, R]>
    : Transform<P, R, Tail<T>, [...A, First<T>]>;

  /** Get position of `V` element from `T` array. */
  export type Position<
    V,
    T extends ReadonlyArray<any>,
    A extends ReadonlyArray<any> = [],
  > = Length<T> extends Length<A>
    ? -1
    : V extends T[Length<A>]
    ? Length<A>
    : Position<V, T, [...A, any]>;

  // Some types are inspired by
  // [this article](https://www.freecodecamp.org/news/typescript-curry-ramda-types-f747e99744ab/)
  /** Return tail elements of A except of X. */
  export type Rest<A extends ReadonlyArray<any>, X extends Partial<A>> = Shift<
    Cast<Length<X>, number>,
    A
  >;

  /** Reverses an array. */
  export type Reverse<
    P extends ReadonlyArray<any>,
    R extends ReadonlyArray<any> = [],
  > = number extends Length<P>
    ? P
    : Length<P> extends 0
    ? R
    : Reverse<Tail<P>, [First<P>, ...R]>;

  /** Get length of array. */
  export type Length<T extends ReadonlyArray<any>> = T['length'];

  /** Get rid of first `Index` elements from a `From` array. */
  export type Shift<
    Index extends number = 0,
    From extends ReadonlyArray<any> = [],
    I extends ReadonlyArray<any> = [],
  > = Length<I> extends Index
    ? From
    : Shift<Index, Tail<From>, [First<From>, ...I]>;

  /** Get rid of last `Index` elements from a `From` array. */
  export type Pop<
    Index extends number = 0,
    From extends ReadonlyArray<any> = [],
    I extends ReadonlyArray<any> = [],
  > = Length<I> extends Index
    ? From
    : Pop<Index, Head<From>, [Last<From>, ...I]>;

  /** Get types of `T` elements except of first one. */
  export type Tail<T extends ReadonlyArray<any>> = T extends [any, ...infer U]
    ? U
    : [];

  /** Get types of `T` elements except of last one. */
  export type Head<T extends ReadonlyArray<any>> = T extends [...infer U, any]
    ? U
    : [];

  /** Get type of _nth_ element of `T`. */
  export type Nth<T extends ReadonlyArray<any>, P extends number> = T[P];

  /** Get type of last element of `T`. */
  export type Last<T extends ReadonlyArray<any>> = Nth<T, Length<Tail<T>>>;

  /** Get type of first element of `T`. */
  export type First<T extends ReadonlyArray<any>> = Nth<T, 0>;

  export type TrimLastEmpty<V extends ReadonlyArray<any>> = Length<
    Last<V>
  > extends 0
    ? TrimLastEmpty<Head<V>>
    : V;

  /**
   * Flattens arrays inside a `V` array that have
   * `Width` length.
   */
  export type Flatten<
    V extends ReadonlyArray<any>,
    Width extends number = 1,
    R extends ReadonlyArray<any> = [],
  > = Length<V> extends 0
    ? R
    : Flatten<
        Tail<V>,
        Width,
        First<V> extends NMath.Counter<Width>
          ? [...R, ...First<V>]
          : [...R, First<V>]
      >;
}

export namespace NFn {
  /** Converts array of function into an array with their return types. */
  export type ReturnTypesOf<
    F extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>,
    R extends ReadonlyArray<any> = [],
  > = NArray.Length<F> extends 0
    ? R
    : ReturnTypesOf<
        NArray.Tail<F>,
        [
          ...R,
          ReturnType<NArray.First<F>> extends Promise<infer U>
            ? U
            : ReturnType<NArray.First<F>>,
        ]
      >;

  /** Converts array of function into an array with their parameters. */
  export type ParametersOf<
    V extends ReadonlyArray<(...values: ReadonlyArray<any>) => any>,
    U extends ReadonlyArray<any> = [],
  > = NArray.Length<V> extends 0
    ? U
    : ParametersOf<NArray.Tail<V>, [...U, Parameters<NArray.First<V>>]>;

  /**
   * Creates function with fixed number of parameters.
   * Where `A` is arity of a function.
   * `T` is desired types of parameters.
   * `R` is a return type of the final function.
   */
  export type Create<
    A extends number,
    T extends ReadonlyArray<any>,
    R,
    P extends ReadonlyArray<any> = [],
  > = NArray.Length<P> extends A
    ? (...args: P) => R
    : Create<
        A,
        NArray.Tail<T> extends [] ? T : NArray.Tail<T>,
        R,
        [...P, NArray.First<T>]
      >;

  /** Checks if all functions have the same parameters set. */
  export type IsParametersEqual<
    F extends ReadonlyArray<(...values: ReadonlyArray<any>) => any>,
    R = [],
  > = NArray.Length<F> extends 0
    ? R extends false
      ? false
      : true
    : IsParametersEqual<
        NArray.Tail<F>,
        R extends []
          ? Parameters<NArray.First<F>>
          : R extends Parameters<NArray.First<F>>
          ? R
          : false
      >;

  /** Detects if at least one among functions is asynchronous. */
  export type IsAsyncIn<
    R extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>,
    A extends boolean = false,
  > = A extends true
    ? A
    : NArray.Length<R> extends 0
    ? A
    : IsAsyncIn<
        NArray.Tail<R>,
        ReturnType<NArray.First<R>> extends Promise<any> ? true : false
      >;

  /** Counts fixed parameters of a function. */
  export type FixedParametersCount<
    P extends ReadonlyArray<any>,
    A extends number = 0,
  > = P extends [any, ...infer R]
    ? FixedParametersCount<R, Cast<NMath.Plus<A, 1>, number>>
    : A;
}

export namespace NMath {
  /**
   * Creates iterable from count of desired
   * values count.
   */
  export type Counter<A extends number> = NArray.Create<A>;

  /** Subtracts two numbers. Result cannot be lower than `0`. */
  export type MinusOrZero<F extends number, S extends number> = NArray.Length<
    NArray.Shift<S, Counter<F>>
  >;

  /** Adds two numbers. */
  export type Plus<F extends number, S extends number> = NArray.Length<
    [...Counter<F>, ...Counter<S>]
  >;
}
