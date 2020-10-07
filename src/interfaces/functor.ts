export interface Functor {
  map(fn: (value: any) => any): Functor;
}
