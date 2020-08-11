export function resolve(): Promise<void>;
export function resolve<T>(value: T | PromiseLike<T>): Promise<T>;
export function resolve<T>(value?: T | PromiseLike<T>): Promise<T | undefined> {
  return Promise.resolve(value);
}
