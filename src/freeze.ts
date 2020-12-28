import { DeepReadonly } from './utilities';

/**
 * Perform shallow(_deep_ is `false`) or deep(_deep_ is `true`)
 * freeze of object. By default function does shallow freezing.
 */
export function freeze<T extends object, D extends boolean = false>(
  value: T,
  // @ts-ignore - TS cannot assing false to boolean :(
  deep: D = false
): D extends true ? DeepReadonly<T> : Readonly<T> {
  if (deep) {
    Object.getOwnPropertyNames(value).forEach((name) => {
      const innerValue = (value as { [key: string]: any })[name];
      if (typeof innerValue === 'object' || typeof innerValue === 'function') {
        freeze(innerValue);
      }
    });
  }

  // @ts-ignore
  return Object.freeze(value);
}
