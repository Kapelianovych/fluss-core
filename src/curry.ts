import type { Cast, NFn, NArray, NMath } from './utilities';

declare namespace Curry {
  type PreserveGaps<
    A extends ReadonlyArray<any>,
    P extends ReadonlyArray<any>,
    R extends ReadonlyArray<any> = [],
  > = NArray.Length<A> extends 0
    ? [...R, ...P]
    : NArray.First<A> extends typeof _
    ? PreserveGaps<NArray.Tail<A>, NArray.Tail<P>, [...R, NArray.First<P>]>
    : PreserveGaps<NArray.Tail<A>, NArray.Tail<P>, R>;

  type With<P extends ReadonlyArray<any>> = {
    [K in keyof P]?: P[K] | typeof _;
  };

  type Cleared<P extends ReadonlyArray<any>> = {
    [K in keyof P]: NonNullable<P[K]>;
  };

  type AddTo<P extends ReadonlyArray<any>> = Cast<
    Cleared<With<P>>,
    ReadonlyArray<any>
  >;

  type ExcludeGaps<
    A extends With<ReadonlyArray<any>>,
    R extends ReadonlyArray<any> = [],
  > = NArray.Length<A> extends 0
    ? R
    : NArray.First<A> extends typeof _
    ? ExcludeGaps<NArray.Tail<A>, R>
    : ExcludeGaps<NArray.Tail<A>, [...R, NArray.First<A>]>;
}

/** Value that preserves place for an argument. */
export const _: unique symbol = Symbol('Placeholder');

type Curried<
  F extends (...args: Array<any>) => any,
  A extends number = NFn.FixedParametersCount<Parameters<F>>,
> = <U extends Curry.AddTo<Parameters<F>>>(
  ...args: U
) => NArray.Length<Curry.ExcludeGaps<U>> extends A
  ? ReturnType<F>
  : number extends NArray.Length<Parameters<F>>
  ? Curried<
      NFn.Create<
        Cast<
          NMath.MinusOrZero<
            A,
            Cast<NArray.Length<Curry.ExcludeGaps<U>>, number>
          >,
          number
        >,
        Curry.PreserveGaps<U, Parameters<F>>,
        ReturnType<F>
      >,
      Cast<
        NMath.MinusOrZero<A, Cast<NArray.Length<Curry.ExcludeGaps<U>>, number>>,
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
    F extends (...args: ReadonlyArray<any>) => any,
    A extends number = NFn.FixedParametersCount<Parameters<F>>,
  >(
    fn: F,
    arity: A = fn.length as any,
  ): Curried<F, A> =>
  (...args) =>
    // @ts-ignore
    args.filter((value) => value !== _).length >= arity
      ? fn(...args)
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
