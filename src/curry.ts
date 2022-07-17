import type { Cast, Tuple, Math } from './utilities.js';

declare namespace Curry {
  type PreserveGaps<
    A extends readonly any[],
    P extends readonly any[],
    R extends readonly any[] = [],
  > = Tuple.Length<A> extends 0
    ? [...R, ...P]
    : Tuple.First<A> extends typeof _
    ? PreserveGaps<Tuple.Shift<A>, Tuple.Shift<P>, [...R, Tuple.First<P>]>
    : PreserveGaps<Tuple.Shift<A>, Tuple.Shift<P>, R>;

  type With<P extends readonly any[]> = {
    [K in keyof P]?: P[K] | typeof _;
  };

  type Cleared<P extends readonly any[]> = {
    [K in keyof P]: NonNullable<P[K]>;
  };

  type AddTo<P extends readonly any[]> = Cast<Cleared<With<P>>, readonly any[]>;

  type ExcludeGaps<
    A extends With<readonly any[]>,
    R extends readonly any[] = [],
  > = Tuple.Length<A> extends 0
    ? R
    : Tuple.First<A> extends typeof _
    ? ExcludeGaps<Tuple.Shift<A>, R>
    : ExcludeGaps<Tuple.Shift<A>, [...R, Tuple.First<A>]>;

  type FixedParametersCount<
    P extends readonly any[],
    A extends number = 0,
  > = P extends [any, ...infer R]
    ? FixedParametersCount<R, Cast<Math.Plus<A, 1>, number>>
    : A;

  type CreateFunction<
    A extends number,
    T extends readonly any[],
    R,
    P extends readonly any[] = [],
  > = Tuple.Length<P> extends A
    ? (...args: P) => R
    : CreateFunction<
        A,
        Tuple.Shift<T> extends [] ? T : Tuple.Shift<T>,
        R,
        [...P, Tuple.First<T>]
      >;
}

/** Value that preserves place for an argument. */
export const _: unique symbol = Symbol('Placeholder');

type Curried<
  F extends (...args: Array<any>) => any,
  A extends number = Curry.FixedParametersCount<Parameters<F>>,
> = <U extends Curry.AddTo<Parameters<F>>>(
  ...args: U
) => Tuple.Length<Curry.ExcludeGaps<U>> extends A
  ? ReturnType<F>
  : number extends Tuple.Length<Parameters<F>>
  ? Curried<
      Curry.CreateFunction<
        Cast<
          Math.Minus<A, Cast<Tuple.Length<Curry.ExcludeGaps<U>>, number>>,
          number
        >,
        Curry.PreserveGaps<U, Parameters<F>>,
        ReturnType<F>
      >,
      Cast<
        Math.Minus<A, Cast<Tuple.Length<Curry.ExcludeGaps<U>>, number>>,
        number
      >
    >
  : Curried<(...args: Curry.PreserveGaps<U, Parameters<F>>) => ReturnType<F>>;

/**
 * Create curried version of function with
 * optional partial application.
 * If function has variadic parameters (...rest), then
 * you can apparently define function's _arity_.
 */
export const curry =
  <
    F extends (...args: readonly any[]) => unknown,
    A extends number = Curry.FixedParametersCount<Parameters<F>>,
  >(
    fn: F,
    arity: A = fn.length as any,
  ): Curried<F, A> =>
  (...args) =>
    // @ts-ignore
    args.filter((value) => value !== _).length >= arity
      ? fn(...args.slice(0, arity))
      : curry(
          (...rest: unknown[]) =>
            fn(
              // @ts-ignore
              ...args
                .map((value) => (_ === value ? rest.shift() : value))
                .concat(rest),
            ),
          arity - args.filter((value) => value !== _).length,
        );
