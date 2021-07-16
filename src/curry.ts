import type {
  Cast,
  Tail,
  First,
  Length,
  MinusOrZero,
  CreateFunction,
  FixedParametersCount,
} from './utilities';

declare namespace Gaps {
  type Preserve<
    A extends ReadonlyArray<any>,
    P extends ReadonlyArray<any>,
    R extends ReadonlyArray<any> = []
  > = Length<A> extends 0
    ? [...R, ...P]
    : First<A> extends typeof _
    ? Preserve<Tail<A>, Tail<P>, [First<P>, ...R]>
    : Preserve<Tail<A>, Tail<P>, R>;

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

  type Exclude<
    A extends With<ReadonlyArray<any>>,
    R extends ReadonlyArray<any> = []
  > = Length<A> extends 0
    ? R
    : First<A> extends typeof _
    ? Exclude<Tail<A>, R>
    : Exclude<Tail<A>, [First<A>, ...R]>;
}

/** Value that preserves place for an argument. */
export const _: unique symbol = Symbol('Placeholder');

type Curry<
  F extends (...args: Array<any>) => any,
  A extends number = FixedParametersCount<Parameters<F>>
> = <U extends Gaps.AddTo<Parameters<F>>>(
  ...args: U
) => Length<Gaps.Exclude<U>> extends A
  ? ReturnType<F>
  : number extends Length<Parameters<F>>
  ? Curry<
      CreateFunction<
        Cast<MinusOrZero<A, Length<U>>, number>,
        Parameters<F>,
        ReturnType<F>
      >,
      Cast<MinusOrZero<A, Length<U>>, number>
    >
  : Curry<(...args: Gaps.Preserve<U, Parameters<F>>) => ReturnType<F>>;

/**
 * Create curried version of function with
 * optional partial application.
 * If function has variadic parameters (...rest), then
 * you can apparently define function's _arity_.
 */
export const curry = <
  F extends (...args: ReadonlyArray<any>) => any,
  A extends number = FixedParametersCount<Parameters<F>>
>(
  fn: F,
  arity: A = fn.length as any
): Curry<F, A> => {
  return (...args) =>
    // @ts-ignore
    args.filter((value) => value !== _).length >= arity
      ? fn(...args)
      : curry(
          (...rest: unknown[]) =>
            fn(
              // @ts-ignore
              ...args
                .map((value) => (_ === value ? rest.shift() : value))
                .concat(rest)
            ),
          arity - args.filter((value) => value !== _).length
        );
};
