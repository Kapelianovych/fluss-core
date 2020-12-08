/** Gets constructor type from object type. */
export type Constructor<T> = {
  new (...args: ReadonlyArray<any>): T;
  prototype: T;
};
