declare module '@fluss/core' {
  export interface Applicative<T> extends Functor<T> {
    /** Maps value by using value of `other` monad. Value of other monad must be a **function type**. */
    apply<R>(other: Applicative<(value: T) => R>): Applicative<R>;
  }
  export interface Chain<T> extends Functor<T> {
    /** Maps inner value and returns new monad instance with new value. */
    chain<R>(fn: (value: T) => Chain<R>): Chain<R>;
  }
  export interface Comonad {
    /** Expose inner value to outside */
    extract(): any;
  }
  export interface Functor<T> {
    /** Maps inner value and returns new monad instance with new value. */
    map<R>(fn: (value: T) => R): Functor<R>;
  }
  export interface Monad<T> extends Applicative<T>, Chain<T> {}

  /**
   * It performs right-to-left function composition.
   */
  export function compose<R>(fn: () => R): () => R;
  export function compose<A, R>(fn: (a: A) => R): (a: A) => R;
  export function compose<A1, A2, R>(
    fn: (a1: A1, a2: A2) => R
  ): (a1: A1, a2: A2) => R;
  export function compose<A1, A2, A3, R>(
    fn: (a1: A1, a2: A2, a3: A3) => R
  ): (a1: A1, a2: A2, a3: A3) => R;
  export function compose<R1, R2>(fn2: (a1: R1) => R2, fn1: () => R1): () => R2;
  export function compose<A, R1, R2>(
    fn2: (a1: R1) => R2,
    fn1: (a: A) => R1
  ): (a: A) => R2;
  export function compose<A1, A2, R1, R2>(
    fn2: (a1: R1) => R2,
    fn1: (a1: A1, a2: A2) => R1
  ): (a1: A1, a2: A2) => R2;
  export function compose<A1, A2, A3, R1, R2>(
    fn2: (a1: R1) => R2,
    fn1: (a1: A1, a2: A2, a3: A3) => R1
  ): (a1: A1, a2: A2, a3: A3) => R2;
  export function compose<R1, R2, R3>(
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: () => R1
  ): () => R3;
  export function compose<A, R1, R2, R3>(
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a: A) => R1
  ): (a: A) => R3;
  export function compose<A1, A2, R1, R2, R3>(
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a1: A1, a2: A2) => R1
  ): (a1: A1, a2: A2) => R3;
  export function compose<A1, A2, A3, R1, R2, R3>(
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a1: A1, a2: A2, a3: A3) => R1
  ): (a1: A1, a2: A2, a3: A3) => R3;
  export function compose<R1, R2, R3, R4>(
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: () => R1
  ): () => R4;
  export function compose<A, R1, R2, R3, R4>(
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a: A) => R1
  ): (a: A) => R4;
  export function compose<A1, A2, R1, R2, R3, R4>(
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a1: A1, a2: A2) => R1
  ): (a1: A1, a2: A2) => R4;
  export function compose<A1, A2, A3, R1, R2, R3, R4>(
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a1: A1, a2: A2, a3: A3) => R1
  ): (a1: A1, a2: A2, a3: A3) => R4;
  export function compose<R1, R2, R3, R4, R5>(
    fn5: (a1: R4) => R5,
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: () => R1
  ): () => R5;
  export function compose<A, R1, R2, R3, R4, R5>(
    fn5: (a1: R4) => R5,
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a: A) => R1
  ): (a: A) => R5;
  export function compose<A1, A2, R1, R2, R3, R4, R5>(
    fn5: (a1: R4) => R5,
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a1: A1, a2: A2) => R1
  ): (a1: A1, a2: A2) => R5;
  export function compose<A1, A2, A3, R1, R2, R3, R4, R5>(
    fn5: (a1: R4) => R5,
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a1: A1, a2: A2, a3: A3) => R1
  ): (a1: A1, a2: A2, a3: A3) => R5;
  export function compose<R1, R2, R3, R4, R5, R6>(
    fn6: (a1: R5) => R6,
    fn5: (a1: R4) => R5,
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: () => R1
  ): () => R6;
  export function compose<A, R1, R2, R3, R4, R5, R6>(
    fn6: (a1: R5) => R6,
    fn5: (a1: R4) => R5,
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a: A) => R1
  ): (a: A) => R6;
  export function compose<A1, A2, R1, R2, R3, R4, R5, R6>(
    fn6: (a1: R5) => R6,
    fn5: (a1: R4) => R5,
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a1: A1, a2: A2) => R1
  ): (a1: A1, a2: A2) => R6;
  export function compose<A1, A2, A3, R1, R2, R3, R4, R5, R6>(
    fn6: (a1: R5) => R6,
    fn5: (a1: R4) => R5,
    fn4: (a1: R3) => R4,
    fn3: (a1: R2) => R3,
    fn2: (a1: R1) => R2,
    fn1: (a1: A1, a2: A2, a3: A3) => R1
  ): (a1: A1, a2: A2, a3: A3) => R6;

  /**
   * Create curried version of function with optional partial application.
   */
  export function curry<R>(fn: () => R, defaultArgs?: []): () => R;
  export function curry<A, R>(fn: (a: A) => R, defaultArgs: [A]): () => R;
  export function curry<A, R>(fn: (a: A) => R, defaultArgs?: [A]): (a: A) => R;
  export function curry<A1, A2, R>(
    fn: (a1: A1, a2: A2) => R,
    defaultArgs: [A1, A2]
  ): () => R;
  export function curry<A1, A2, R>(
    fn: (a1: A1, a2: A2) => R,
    defaultArgs: [A1]
  ): (a2: A2) => R;
  export function curry<A1, A2, R>(
    fn: (a1: A1, a2: A2) => R,
    defaultArgs?: [A1, A2]
  ): (a1: A1) => (a2: A2) => R;
  export function curry<A1, A2, A3, R>(
    fn: (a1: A1, a2: A2, a3: A3) => R,
    defaultArgs: [A1, A2]
  ): (a3: A3) => R;
  export function curry<A1, A2, A3, R>(
    fn: (a1: A1, a2: A2, a3: A3) => R,
    defaultArgs: [A1]
  ): (a2: A2) => (a3: A3) => R;
  export function curry<A1, A2, A3, R>(
    fn: (a1: A1, a2: A2, a3: A3) => R,
    defaultArgs?: [A1, A2, A3]
  ): (a1: A1) => (a2: A2) => (a3: A3) => R;

  /** Allow join output of two functions that get the same input and process it in a different way. */
  export function fork<T, R, R1, R2>(
    join: (f: R1, s: R2) => R,
    fn1: (a: T) => R1,
    fn2: (a: T) => R2
  ): (a: T) => R;
  export function fork<T, T1, R, R1, R2>(
    join: (f: R1, s: R2) => R,
    fn1: (a: T, a1: T1) => R1,
    fn2: (a: T, a1: T1) => R2
  ): (a: T, a1: T1) => R;
  export function fork<T, T1, T2, R, R1, R2>(
    join: (f: R1, s: R2) => R,
    fn1: (a: T, a1: T1, a2: T2) => R1,
    fn2: (a: T, a1: T1, a2: T2) => R2
  ): (a: T, a1: T1, a2: T2) => R;

  /**
   * Lets accomplish condition logic depending of function application.
   * If function returns `NaN`, `null` or `undefined`, then result of next function is checked.
   * If no function return non-empty value, then result of last function is returned.
   */
  export function alternation<R>(fn: () => R, fn1: () => R): () => R;
  export function alternation<T, R>(
    fn: (a: T) => R,
    fn1: (a: T) => R
  ): (a: T) => R;
  export function alternation<T, T1, R>(
    fn: (a: T, a1: T1) => R,
    fn1: (a: T, a1: T1) => R
  ): (a: T, a1: T1) => R;
  export function alternation<T, T1, T2, R>(
    fn: (a: T, a1: T1, a2: T2) => R,
    fn1: (a: T, a1: T1, a2: T2) => R
  ): (a: T, a1: T1, a2: T2) => R;
  export function alternation<R>(
    fn: () => R,
    fn1: () => R,
    fn2: () => R
  ): () => R;
  export function alternation<T, R>(
    fn: (a: T) => R,
    fn1: (a: T) => R,
    fn2: (a: T) => R
  ): (a: T) => R;
  export function alternation<T, T1, R>(
    fn: (a: T, a1: T1) => R,
    fn1: (a: T, a1: T1) => R,
    fn2: (a: T, a1: T1) => R
  ): (a: T, a1: T1) => R;
  export function alternation<T, T1, T2, R>(
    fn: (a: T, a1: T1, a2: T2) => R,
    fn1: (a: T, a1: T1, a2: T2) => R,
    fn2: (a: T, a1: T1, a2: T2) => R
  ): (a: T, a1: T1, a2: T2) => R;

  /** Just return the same value. */
  export function identity<T>(value: T): T;

  /** Checks if value is `null` or `undefined`. */
  export function isNothing<T>(
    value: T | null | undefined
  ): value is undefined | null;

  /**
   * Lets invoke independent functions with the same value in order that they are declared.
   */
  export function sequence<V>(
    ...fns: ReadonlyArray<(value: V) => any>
  ): (value: V) => void;

  /**
   * Performs side-effect on `value` by `fn` and returns the same value.
   *
   * - Function `fn` may return any value - it will be discarded.
   * - Function `fn` must not mutate `value`.
   */
  export function tap<T>(fn: (value: Readonly<T>) => any): (a: T) => T;

  /**
   * Wraps code into `try/catch` and returns `Either` monad with result.
   * If `catchFn` is not `undefined`, then `Either` with result will
   * be returned, otherwise - `Either` with error.
   */
  export function tryCatch<T, R, L extends Error>(
    tryFn: (input: T) => R,
    catchFn?: (error: L) => R
  ): (input: T) => Either<L, R>;
  export function tryCatch<T, R, L extends Error>(
    tryFn: (input: T) => Promise<R>,
    catchFn?: (error: L) => Promise<R>
  ): (input: T) => Promise<Either<L, R>>;

  class WrapperConstructor<T> implements Comonad, Monad<T> {
    static wrap<U>(value: U): Wrapper<U>;

    map<R>(fn: (value: T) => R): Wrapper<R>;

    apply<R>(other: Wrapper<(value: T) => R>): Wrapper<R>;

    chain<R>(fn: (value: T) => Wrapper<R>): Wrapper<R>;

    extract(): T;
  }
  /** Monad that contains value and allow perform operation on it by set of methods. */
  export type Wrapper<T> = WrapperConstructor<T>;
  /** Wraps value in `Wrapper` monad and allow perform on it operations in chainable way. */
  export function wrap<T>(value: T): Wrapper<T>;

  export const enum MaybeType {
    Just = 'Just',
    Nothing = 'Nothing',
  }

  class MaybeConstructor<V, T extends MaybeType = MaybeType>
    implements Comonad, Monad<V> {
    static just<T>(value: T): MaybeConstructor<T, MaybeType.Just>;

    static nothing<T>(): MaybeConstructor<T, MaybeType.Nothing>;

    static maybeOf<T>(value: T | null | undefined): Maybe<T>;

    isJust(): this is MaybeConstructor<V, MaybeType.Just>;

    isNothing(): this is MaybeConstructor<V, MaybeType.Nothing>;

    map<R>(fn: (value: V) => R): Maybe<R>;

    apply<R>(other: Maybe<(value: V) => R>): Maybe<R>;

    chain<R>(fn: (value: V) => Maybe<R>): Maybe<R>;

    extract(): T extends MaybeType.Just ? V : null | undefined;
  }
  /**
   * Monad that gets rid of `null` and `undefined`. Its methods works only if inner value is not
   * _nothing_(`null` and `undefined`) and its state is `Just`, otherwise they aren't invoked (except `extract`).
   * Wraps _nullable_ value and allow works with it without checking on `null` and `undefined`.
   */
  export type Maybe<V> =
    | MaybeConstructor<V, MaybeType.Just>
    | MaybeConstructor<V, MaybeType.Nothing>;

  /** Wraps value with `Maybe` monad with **Just** state. */
  export function just<T>(value: T): MaybeConstructor<T, MaybeType.Just>;
  /** Creates `Maybe` monad instance with **Nothing** state. */
  export function nothing<T>(): MaybeConstructor<T, MaybeType.Nothing>;
  /** Wraps value with `Maybe` monad. Function detects state (**Just** or **Nothing**) of `Maybe` by yourself. */
  export function maybeOf<T>(
    value: T
  ): T extends null
    ? MaybeConstructor<T, MaybeType.Nothing>
    : T extends undefined
    ? MaybeConstructor<T, MaybeType.Nothing>
    : MaybeConstructor<T, MaybeType.Just>;
  /** Checks if value is instance of `Maybe` monad. */
  export function isMaybe<T>(value: any): value is Maybe<T>;

  const enum EitherType {
    Left = 'Left',
    Right = 'Right',
  }

  class EitherConstructor<L extends Error, R, T extends EitherType = EitherType>
    implements Comonad, Monad<R> {
    static left<L extends Error, R>(
      value: L
    ): EitherConstructor<L, R, EitherType.Left>;

    static right<L extends Error, R>(
      value: R
    ): EitherConstructor<L, R, EitherType.Right>;

    static eitherOf<A extends Error, B>(value: A | B): Either<A, B>;

    isRight(): this is EitherConstructor<L, R, EitherType.Right>;

    isLeft(): this is EitherConstructor<L, R, EitherType.Left>;

    map<A>(fn: (value: R) => A): Either<L, A>;

    /** Maps inner value if it is not an `Error` instance. Same as `Either.map`. */
    mapRight<A>(fn: (value: R) => A): Either<L, A>;

    /** Maps inner value if it is an `Error` instance */
    mapLeft<E extends Error>(fn: (value: L) => E): Either<E, R>;

    apply<U>(other: Either<L, (value: R) => U>): Either<L, U>;

    chain<U>(fn: (value: R) => Either<L, U>): Either<L, U>;

    extract(): T extends EitherType.Left ? L : R;
  }
  /**
   * Monad that can contain value or `Error`. Allow handles errors in functional way.
   */
  export type Either<L extends Error, R> =
    | EitherConstructor<L, R, EitherType.Right>
    | EitherConstructor<L, R, EitherType.Left>;

  /** Creates `Either` monad instance with **Left** state. */
  export function left<L extends Error, R>(value: L): Either<L, R>;
  export function right<L extends Error, R>(value: R): Either<L, R>;
  /** Wraps value with `Either` monad. Function detects state (**Right** or **Left**) of `Either` by yourself. */
  export function eitherOf<L extends Error, R>(value: R | L): Either<L, R>;
  /** Checks if value is instance of `Either` monad. */
  export function isEither<L extends Error, R>(
    value: any
  ): value is Either<L, R>;
}
