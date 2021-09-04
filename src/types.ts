export interface Functor<T> {
  /** Maps inner value and returns new monad instance with new value. */
  map<R>(fn: (value: T) => R): Functor<R>;
}

export interface Apply<T> extends Functor<T> {
  /**
   * Maps value by using value of `other` monad.
   * Value of other monad must be a **function type**.
   */
  apply<R>(other: Apply<(value: T) => R>): Apply<R>;
}

export interface Chain<T> extends Apply<T> {
  /** Maps inner value and returns new monad instance with new value. */
  chain<R>(fn: (value: T) => Chain<R>): Chain<R>;
}

export interface Comonad<T> extends Functor<T> {
  /** Expose inner value to outside. */
  extract(): T;
}

export interface Monad<T> extends Chain<T> {}

export interface Reducer<I, V> {
  (accumulator: I, current: V): I;
  // It is needed for proper TypeScript inference.
  (accumulator?: I, current?: V): I;
}

export interface Transducer<I, V, K> {
  (reducer: Reducer<I, V>): Reducer<I, K>;
}

export interface Foldable<T> {
  /** Reduce iterable to some value. */
  reduce<R>(fn: Reducer<R, T>): R;
}

export interface Filterable<T> {
  /** Filter data based on the _predicate_ function. */
  filter(predicate: (value: T) => boolean): Filterable<T>;
}

export interface Semigroup<T> {
  /** Join values together. */
  concat(other: Semigroup<T>): Semigroup<T>;
}

export interface Semigroupoid<A, B> {
  compose<C>(other: Semigroupoid<B, C>): Semigroupoid<A, C>;
}

export interface SerializabledObject<T> {
  readonly type: string;
  readonly value: T;
}

export interface Serializable<T> {
  /** Convert data structure to serializable object. */
  toJSON(): SerializabledObject<T>;
}

/** Function that returns iterable iterator. */
export interface IterableIteratorFunction<T> {
  (): IterableIterator<T>;
}

export interface Typeable {
  /** Return type name of a object. */
  type(): string;
}

export interface Sizeable {
  /** Return amount of a aggregated values. */
  size(): number;
  isEmpty(): boolean;
}
