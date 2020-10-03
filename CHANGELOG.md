# [0.6.0] - 2020-10-03

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
