import { isNothing } from './is_nothing';
import { Maybe, maybe } from './maybe';

/**
 * Gets deep value of object based on path of keys.
 */
export function path<R>(
  keysList: string | ReadonlyArray<string>,
  obj: { [index: string]: any }
): Maybe<R> {
  const partsOfPath =
    typeof keysList === 'string' ? keysList.split('.') : keysList;

  // @ts-ignore
  return maybe(
    partsOfPath.reduce(
      (value, part) =>
        isNothing(value)
          ? null
          : typeof value === 'object'
          ? value[part]
          : null,
      obj
    )
  );
}
