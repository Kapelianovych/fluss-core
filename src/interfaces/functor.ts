export interface Functor {
  /** Maps inner value and returns new monad instance with new value. */
  map(fn: (value: any) => any): Functor;
}
