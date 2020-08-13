# [0.4.0] - 2020-08-12

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
