import { reduce } from './reduce';
import { isArray } from './is_array';
import { isNothing } from './is_nothing';
import { Maybe, maybeOf } from './maybe';

export function path<R>(
  keysList: string | Array<string>,
  obj: { [index: string]: any }
): Maybe<R> {
  const partsOfPath = isArray(keysList) ? keysList : keysList.split('.');

  // @ts-ignore
  return maybeOf(
    reduce(
      partsOfPath,
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
