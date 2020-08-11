export function reject(): Promise<never>;
export function reject<E extends Error>(reason: E): Promise<never>;
export function reject<E extends Error>(reason?: E): Promise<never> {
  return Promise.reject(reason);
}
