# Unreleased

### Added

- `Brand`, `Flavor`, `HasNothing`, `Just` and `Nothing` utility type.
- `Serializable` interface.
- `uniqueBy`, `toJSON` (make `List` serializable), `skip`, `find`, `compress`, `sort` and `take` methods to `List`.
- `toJSON` method to `Maybe`.
- `toJSON` method to `Either`.
- `reviver` function to deserialize `Maybe`, `List` and `Either` (also with _Left_ state) monads.
- `pipe` function (perform left-to-right composition).

### Changed

- Signature of `nothing`, `just` functions, `map`, `chain` and `apply` methods of `Maybe`.
- Signature of `isNothing` function.
- Rename `some` method of `List` as `any` and `every` as `all`.

### Removed

- `path` function.
- `promise` function.
- `compose` function.
- `alternation` function.
- `unique` method from `List`.

### Fixed

- `list` function to properly handling _null_ value.
- `array` function to properly handling _null_ value.
- Converting _undefined_ value to _null_ in `Maybe` constructor (for serialization purposes).

## [0.15.1] - 2020-12-15

### Fixed

- Get rid of temporary list creation in `chain` method of `List`.

## [0.15.0] - 2020-12-14

### Added

- `fill` method to `Maybe`.

## [0.14.0] - 2020-12-14

### Added

- `List` monad (lazy Array) and `isList` function.
- `Foldable` and `Filterable` interfaces.
- Generic parameters to interfaces.
- **exports** field to _package.json_.

### Fixed

- Remove inner calls of `Object.freeze` method due to performance issues.

## [0.13.0] - 2020-12-12

### Added

- `apply` method to `Task` monad.
- Return back `just` method of `Maybe`.

## [0.12.0] - 2020-12-11

### Added

- `SomePartial`, `StrictSomePartial`, `SomeRequired`, `StrictSomeRequired`, `Rest`, `Length`, `Shift`, `Cast`, `Last` and `Tail` types.

### Changed

- Signature of `curry` function.
- Type signature of `compose` function.
- Type signature of `alternation` function.
- Type signature of `tuple` function.
- Type signature of `fork` function.
- Type signature of inner value of `Maybe`.

### Removed

- Ability to return error in `map`, `mapRight` and `apply` methods of `Either`.
- `just` method of `Maybe`.

## [0.11.0] - 2020-12-08

### Added

- `Task` monad.
- `isError` function.
- `Constructor<T>` utility type.

### Fixed

- `compose` function on calling without arguments.

## [0.10.1] - 2020-12-07

### Fixed

- Get rid of ECMAScript's private class field from `Either`, `Maybe` and `Wrapper` due to error of importing tslib helpers.

## [0.10.0] - 2020-12-07

### Changed

- Rename `maybeOf` to `maybe`, `eitherOf` to `either`, `promiseOf` to `promise`, `tupleOf` to `tuple`, `arrayFrom` to `array`.
- Makes inner values if `Wrapper`, `Maybe` and `Either` types as ECMAScript private fields.
- `array` function can accept now plain values (along with `ArrayLike` and `Iterable` objects) and will add it to resulting array.

## [0.9.1] - 2020-11-29

### Changed

- Move interfaces to `types.ts` file.

## [0.9.0] - 2020-11-28

### Added

- `type="module"` field to package.json.

### Changed

- Compile each function as separate module in bundle.

## [0.8.0] - 2020-10-20

### Changed

- Bundle uses now ES2018 features.

### Removed

- CommonJS bundle version of package.

## [0.7.0] - 2020-10-07

### Changed

- Make `Either` and `Maybe` types stricter.

### Removed

- Generic types from interfaces.

## [0.6.0] - 2020-10-03

### Changed

- `sequence` now returns function (back to first implementation).

## [0.5.4] - 2020-09-04

### Removed

- One overload of `promiseOf` function in d.ts file.
- Defunct `tap` function declaration.

## [0.5.3] - 2020-09-04

### Fixed

- Add `PromiseLike` type to `promiseOf`'s parameter type.

## [0.5.2] - 2020-09-04

### Changed

- `wrap` can make copy of `Wrapper` instance now.
- `maybeOf` can make copy of `Maybe` instance now.
- `eitherOf` can make copy of `Either` instance now.

## [0.5.1] - 2020-09-03

### Fixed

- Incorrect type narrowing in Maybe when function inside map or apply return null or undefined.
- Incorrect type narrowing in Either when function inside map or apply return Error.

## [0.5.0] - 2020-09-03

### Added

- `freeze` function.

### Changed

- Add underscore to inner value and type of `MaybeConstructor`, `WrapperConstructor` and `EitherConstructor` to show that these fields are private.

### Removed

- `arrayOf`, `concat`, `forEach`, `isArray`, `resolve`, `reject`, `reduce`, `keys`, `values`, `entries`, `tap` functions.

## [0.4.2] - 2020-08-25

### Removed

- Module declaration in `d.ts` file.

## [0.4.1] - 2020-08-16

### Changed

- Change return types in parameters of `alternation` function and function itself.

### Fixed

- Invoking parameter functions of `alternation` twice on checking for its result - now they invokes only once.
- Verbose type `Maybe`.

## [0.4.0] - 2020-08-12

### Added

- `reduce`, `concat`, `forEach`, `keys`, `values`, `entries`, `path` function.

## [0.3.1] - 2020-08-12

### Fixed

- set default type of `nothing` to _null_.
- type of argument of `maybeOf` function. Now it handles propetly _null_ and _undefined_.

### Added

- Missed overload of `curry` function.

## [0.3.0] - 2020-08-12

### Added

- `isArray`, `resolve`, `reject`, `promiseOf`, `arrayOf`, `arrayFrom`, `tupleOf` functions.

## [0.2.0] - 2020-08-10

### Added

- `isPromise`, `isWrapper` function.
- test suites for all functions.

### Changed

- type of value in `tap`'s function argument.

## [0.1.3] - 2020-08-10

### Fixed

- Replace generic argments in `tryCatch` function.

### Changed

- `tap` and `sequence` function's first parameter is value now. They no more return function.

## [0.1.2] - 2020-08-10

### Fixed

- Fix losing state of `Maybe` monad in methods.
- Fix losing state of `Either` monad in methods.

## [0.1.1] - 2020-08-10

### Added

- Add private constructor and fields to `EitherConstructor` in declaration file.
- Add private constructor and fields to `MaybeConstructor` in declaration file.
- Add private constructor and field to `WrapperConstructor` in declaration file.

### Fixed

- Fix return type of `right`, `left` and `eitherOf` functions.
- Fix return type and argument type of `just`, `nothing` and `maybeOf` functions.

## [0.1.0] - 2020-08-09

### Added

- Created `Either`, `Wrapper` and `Maybe` structures.
- Created `identity`, `alternation`, `sequence`, `compose`, `curry`, `tap`, `fork`, `isNothing`, `tryCatch` functions.
- Created `wrap`, `just`, `nothing`, `maybeOf` `isMaybe`, `left`, `right`, `eitherOf` and `isEither` functions that returns structures.
- Created `Applicative`, `Chain`, `Comonad`, `Functor` and `Monad` interfaces.
