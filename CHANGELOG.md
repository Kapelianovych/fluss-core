# [0.36.0] - 2022-07-17

The library was significantly simplified with a lot of breaking changes compared to the previous version.

### Added

- `mergeResults` and `tryExecute` functions from the `Result` monad.
- `mergeTasks` from the `Task` monad.
- `++` operator for string concatenation in `binary` function. The old `+` operator operates only on numbers now.
- `awaitedTap` which waits for the side effect callback to finish before returning the value.

### Changed

- All monad constructors were capitalized.
- `Option` monad exports only the `Some` function and `None` constant.
- `Either` monad was renamed to the `Result` and exports only `Ok` and `Err` functions.
- `Done` function was renamed to `Succeed`. 
- `Stream` monad was completely redesigned with only two methods: `send` and `forEach`. Transformation methods should be passed as arguments to the `Stream` function now.
- Namespaces have lost the `N` prefix.

### Removed

- `sequentially`, `concurrently`, `isNothing`, `tryCatch`, `freeze`, `fork`, `demethodize` and `array` functions.
- All transducer functions and types.
- All monad types.
- The `NFn` namespace.
- Type signature of function in the *README.md*.

### Fixed

- Including extra parameters into curried function call.

## [0.35.0] - 2021-09-07

### Added

- `If` type.
- `IsSameInnerType` type to `NArray` namespace.

### Changed

- if functions that are passed to `sequentially` or `concurrently` have the same parameters type then them can be passed only as single argument.

## [0.34.1] - 2021-09-05

### Fixed

- order of transducers composition from _right to left_ to _left to right_.
- invocation of `transduce` function without any transducer returns accumulator with the same values from transduced instance.

## [0.34.0] - 2021-09-04

### Added

- `Reducer` and `Transducer` types.
- `reducer` function to build reducer function.
- `transduce` function to transform foldable instance into some value.
- `map` and `filter` functions that build transducer functions.
- `toArray` and `toList` reducer builders.

### Changed

- `take` and `skip` methods of `List` accept a _while_ predicate function now.
- `reduce` method of `List` to accept a `Reducer` only.
- `prepend` method of `List` accepts another `List` only.
- `send` method of `Stream` returns `void`.
- `tap` can accept asynchronous effect.

### Fixed

- pass _deep_ parameter to recursive call of `freeze` function.

### Removed

- `Compressable` type.
- `compress` method from `List`.
- `uniqueBy` method from `List` because it hides cache implementation.
- `append` method of `List`.
- `StreamEvents` enum.
- `on`, `freeze`, `resume`, `destroy`, `compress` and `uniqueBy` methods from `Stream`.
- `Container`, `Lazy` and `Tuple` monads.

## [0.33.0] - 2021-09-02

### Added

- `tap` function.

### Removed

- `Compressable` type.
- `compress` method from `Stream` and `List`;

## [0.32.0] - 2021-08-29

### Changed

- `fork` function will execute functions synchronously if all argument functions are synchronous.

## [0.31.4] - 2021-08-28

### Fixed

- Refine code of `binary` and `reviver` functions to increase speed of execution.

## [0.31.3] - 2021-08-25

### Fixed

- Type of internal delay function.

## [0.31.2] - 2021-08-19

### Fixed

- Replace bitwise `|` operator from numeric operations of `binary` function to explicit checking for `NaN` and `Infinity`.

## [0.31.1] - 2021-08-18

### Fixed

- Inferring return type of `onTrue` and `onFalse` functions of `when` function.

## [0.31.0] - 2021-08-13

### Added

- `when` function.

## [0.30.2] - 2021-08-01

### Fixed

- Reversing parameters in curried function after applying arguments.

## [0.30.1] - 2021-08-01

### Fixed

- Inferring function parameters of curried function when several placeholders were applied to it.

## [0.30.0] - 2021-07-31

### Added

- `NArray.Create` type.

### Changed

- `NFn.IsAsync` type has renamed into `NFn.IsAsyncIn`.
- `NArray.SingleOrMany` type has renamed into `NArray.Flatten`. And it has got second generic parameter - `Width`.

## [0.29.1] - 2021-07-28

### Fixed

- Remove filtering `undefined` in parameters for `concurrently` and `sequentially` functions.

## [0.29.0] - 2021-07-28

### Added

- `NFn`, `NMath` and `NArray` type namespaces. Move relative types to them.
- `ParametersOf` type to `NFn` namespace.

### Changed

- `demethodize` function now accepts object and name of the function to be extracted and returned function just accepts arguments of the original method.
- `sequentially` returns function that accepts array of according function parameters now.
- `concurrently` returns function that accepts array of according function parameters now.

## [0.28.0] - 2021-07-22

### Changed

- `tryCatch` function returns raw result if _catchFn_ is defined, otherwise `Either` with an error or result.

## [0.27.0] - 2021-07-17

### Changed

- `delay` function can now return special object that has three properties: `canceled` - tells if a delay is canceled, `result` - holds return value of delayed function and `cancel` - function that cancels the delay.
- Separate `join` parameter from `fork` function into returned function. Now `fork`'s result is always `Promise`, because functions are executed in parallel.

### Removed

- `cancelDelay` function.

## [0.26.1] - 2021-07-16

### Fixed

- Executing functions one after another in `sequentially`.

## [0.26.0] - 2021-07-16

### Added

- Exponentiation operator to `binary` function.

### Changed

- Return type of `debounce`'s, `throttle`'s parameter function should be `void`.
- Replace `unknown` type in all utility types to `any`.

### Fixed

- Inferring function parameters in `throttle`, `consequent`, `curry`, `debounce`, `memoize`, `once`, `sequentially`, `tryCatch`, `tuple` functions.
- Return valid number for number operator from `binary` function.
- Inferring `chain` return type in `Right` monad.
- Improve typing of `fork` function.

## [0.25.0] - 2021-07-14

### Added

- Return back `identity` function.
- `concurrently` function.

### Changed

- `ReturnTypesOf` now can get inner value of the `Promise`.
- `HasPromise` type accepts a tuple of functions now.
- if functions passed to `sequentially` vary by parameters then returned function has `never` type for them.
- `sequentially` can return results from all functions as plain array or Promise of array now.

## [0.24.0] - 2021-07-10

### Added

- `demethodize`, `binary`, `flip` function.
- Placeholder value (`_`) to preserve place for argument.
- `Reverse`, `Nth` type.
- `cache` key to memoized function.

### Changed

- `curry` function can now preserve places for arguments.
- `Curry` type was rewritten. Thanks to [that great article from Pierre-Antoine Mills](https://www.freecodecamp.org/news/typescript-curry-ramda-types-f747e99744ab/).
- If functions passed to `pipe` function cannot be composed then return type of result function is `never`.
- Rewrite `once` function to return result without `Option`.

## [0.23.0] - 2021-06-27

### Added

- Export `FRAME_TIME` constant from library.
- Generic type of a function to `isFunction` function.
- `debounce`, `consequent`, `delay`, `cancelDelay` functions.

### Changed

- By default, `throttle`'s interval is **0** frames now.
- `throttle` function will execute a function immediately at first invocation.
- All type names of monads are prepended with `$` sign.

## [0.22.0] - 2021-06-04

### Added

- `memoize` function.

## [0.21.0] - 2021-05-27

### Changed

- `send`, `resume`, `freeze` and `destroy` methods of `Stream` object return `Stream` object now.
- `throttle` function try to use `requestAnimationFrame` when _frames_ argument is **1** or less.

## [0.20.0] - 2021-05-26

### Added

- `throttle` function.

### Changed

- Return type of `chain` method of `Right` monad depends on return value of _fn_ parameter now.

## [0.19.1] - 2021-04-25

### Changed

- `pipe` function can now compose asynchronous functions along with synchronous ones.

## [0.19.0] - 2021-04-19

### Added

- `Idle` monad and `isIdle` function.
- `isJust` function.
- `isObject` function.
- `isFunction` function.
- `Typeable`, `Sizeable`, `Semigroupoid`, `Semigroup` and `Compressable` interfaces.
- `apply` method to `Stream`.
- `concat` and `asArray` method to `Tuple`.
- `once` function.

### Changed

- `Comonad` interface extends now `Functor`.
- Rename `fold` method of `Foldable` interface to `reduce` due to match [Fantasy Land specification](https://github.com/fantasyland/fantasy-land).
- Refactor `Maybe` type to `Option`, `just` to `some`, `nothing` function to `none` constant.
- Rename `join` method of `List` to `concat`.
- Rename `join` method of `Stream` to `concat`.
- `on`, `freeze`, `resume`, `send` and `destroy` methods of `Stream` return now _undefined_ value.
- Signature of `either` function: it now accept _isRight_ function as first parameter.
- Rename `sequence` function to `sequentially` and now it can handle asynchronous functions.

### Fixed

- Destructure value in `reviver` for constructing `tuple`.

## [0.18.0] - 2021-02-16

### Added

- `Tuple` type and `isTuple` function.
- `First`, `Widen`, `Shift`, `Pop`, `Head`, `Transform`, `Position` utility types.
- `Stream` functor and `isStream` function.

### Changed

- Rename `Applicative` to `Apply` according to [Fantasy Land specification](https://github.com/fantasyland/fantasy-land#apply)
- Rename `Wrapper` type to `Container` and `isWrapper` function to `isContainer`.
- Make `Container` serializable.
- `tuple` function constructs now `Tuple` object.
- `reviver` can now parse `Container` and `Tuple` from JSON string.
- Move `IterableFunction` to _types.ts_ and rename it to `IterableIteratorFunction`.
- Rename `result` method of `Lazy` to `run`.

## [0.17.0] - 2021-02-05

### Added

- Default error type to `Task` class, `task`, `done` and `fail` functions.
- Add `Lazy` monad and `isLazy` function.

### Changed

- Change type signature of `pipe` function to raise _unknown_ type if parameters chain is incompatible.
- Change signature of `sequence` function to accept more than one argument.

### Fixed

- Typo in `Task` doc comment.

## [0.16.0] - 2021-01-04

### Added

- `Brand`, `Flavor`, `DeepReadonly`, `HasNothing`, `Just` and `Nothing` utility type.
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
- Signature of `freeze` function.

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
- Walking twice on list in `fold` method.
- Increase `isEmpty` and `take` methods performance.

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
