export interface Functor<T> {
  map<R>(fn: (value: T) => R): Functor<R>;
}
