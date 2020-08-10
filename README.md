# @fluss/core

`@fluss/core` - small library that contains couple functions for easy functional coding.

## Example use

```typescript
const result = curry((left: string, right: string) => left + right); // TypeScript infer result variable as (a: string) => (b: string) => string
const result2 = curry((left: string, right: string) => left + right, [
  'Left and ',
]); // TypeScript infer result2 variable as (b: string) => string
```

## @fluss/core's advantages

- TypeScript included

TypeScript definitions are included in the library.

- Small size

# Install

```sh
npm i @fluss/core
```

## API

> In JavaScript examples is used [Flow](https://flow.org)'s comment notation.

> **Each function must have no more than 3 arguments.**
> Using functions with long arguments list is not comfortable and convenient.

### identity

```typescript
function identity<T>(value: T): T;
```

Just return the same value.

```javascript
const same /*: 6 */ = identity(6);
```

### tap

```typescript
function tap<T>(fn: (value: Readonly<T>) => any): (value: T) => T;
```

Performs side-effect on `value` by `fn` and returns the same value.

- Function `fn` may return any value - it will be discarded.
- Function `fn` must not mutate `value`.

```javascript
// All numbers will logs to console. Useful for assertions.
const bridge /*: (value: number) => number */ = tap < number > console.log;
```

### compose

```typescript
function compose<A, R1, R2>(
  // Up to 6 functions
  fn2: (a1: R1) => R2,
  fn1: (a: A) => R1
): (a: A) => R2;
```

Compose functions from right to left.

```javascript
const fn /*: (str: string) => string */ = compose(
  (str) => str + 3,
  (str) => str + 2
);
const result /*: '123' */ = fn('1');
```

### curry

```typescript
function curry<A1, A2, R>(
    fn: (a1: A1, a2: A2) => R,
    defaultArgs: [A1, A2]
  ): () => R;
  curry<A1, A2, R>(
    fn: (a1: A1, a2: A2) => R,
    defaultArgs: [A1]
  ): (a2: A2) => R;
  curry<A1, A2, R>(
    fn: (a1: A1, a2: A2) => R,
    defaultArgs?: [A1, A2]
  ): (a1: A1) => (a2: A2) => R;
```

Create curried version of function with optional partial application.

```javascript
const fn /*: (str1: string) => (str2: string) => string */ = curry(
  (str1, str2) => str1 + str2 + 3
);
// TypeScript is smart enough 😜
const fn1 /*: (str2: string) => string */ = curry(
  (str1, str2) => str1 + str2 + 3,
  ['1']
);
```

### fork

```typescript
function fork<T, R, R1, R2>(
  join: (f: R1, s: R2) => R,
  fn1: (a: T) => R1,
  fn2: (a: T) => R2
): (a: T) => R;
```

Allow join output of two functions that get the same input and process it in a different way.

```javascript
// Compute average.
const y /*: (a: Array<number>) => number */ = fork(
  (sum: number, count: string) => sum / coung,
  (a: Array<number>) => a.reduce((sum, num) => sum + num, 0),
  (a: Array<number>) => a.length
);
```

### alternation

```typescript
function alternation<T, R>(fn: (a: T) => R, fn1: (a: T) => R): (a: T) => R;
```

Lets accomplish condition logic depending of function application.
If function returns `NaN`, `null` or `undefined`, then result of next function is checked.
If no function return non-empty value, then result of last function is returned.

```javascript
const y /*: (a: Array<number>) => number */ = alternation(
  (sum: number) => sum - 3,
  (sum: number) => sum // As default value if first function returns NaN
);
```

### sequence

```typescript
function sequence<V>(
  ...fns: ReadonlyArray<(value: V) => any>
): (value: V) => void;
```

Lets invoke independent functions with the same value in order that they are declared.

```javascript
const y /*: (e: SomeError) => void */ = sequence(
  console.log, // 1
  logIntoFile, // 2
  sendOverNetwork // 3
);
```

### isNothing

```typescript
function isNothing<T>(value: T | null | undefined): value is undefined | null;
```

Checks if value is `null` or `undefined`.

```javascript
const y /*: true */ = isNothing(null);
const y1 /*: false */ = isNothing(false);
const y1 /*: false */ = isNothing(0);
```

### tryCatch

```typescript
function tryCatch<T, R, L extends Error>(
  tryFn: (input: T) => R,
  catchFn?: (error: L) => R
): (input: T) => Either<L, R>;
```

Wraps code into `try/catch` and returns `Either` monad with result. If `catchFn` is not `undefined`, then `Either` with result will be returned, otherwise - `Either` with error. Asyncronous version is also existed.

```javascript
const getUser /*: (id: string) => Either<NoUserError, User> */ = tryCatch(
  (id: string) => getUserFromDbById(id),
  (error: NoUserError) => createUser()
);
```

### wrap

```typescript
function wrap<T>(value: T): Wrapper<T>;
```

Wraps value in `Wrapper` monad and allow perform on it operations in chainable way.

```javascript
wrap(1)
  .map((num) => num + '0')
  .chain((str) => wrap(parseInt(str)))
  .apply(wrap((num) => Math.pow(num, 2)))
  .extract(); // => 100
```

#### Wrapper

Monad that contains value and allow perform operation on it by set of methods.

1. `map<R>(fn: (value: T) => R): Wrapper<R>` - maps inner value and returns new `Wrapper` instance with new value.

2. `chain<R>(fn: (value: T) => Wrapper<R>): Wrapper<R>` - the same as `map`, but function must return already wrapped value.

3. `apply<R>(other: Wrapper<(value: T) => R>): Wrapper<R>` - maps value by using value of `other` wrapper. Value of other wrapper must be a function type.

4. `extract(): T` - expose inner value to outside.

> These methods have also `Maybe` and `Either` monads.

### isMaybe

```typescript
function isMaybe<T>(value: any): value is Maybe<T>;
```

Checks if value is instance of `Maybe` monad.

```javascript
isMaybe(8); // false
isMaybe(maybeOf(8)); // true
```

### maybeOf

```typescript
function maybeOf<T>(value: T): Maybe<T>;
```

Wraps value with `Maybe` monad. Function detects state (**Just** or **Nothing**) of `Maybe` by yourself.

```javascript
maybeOf(8); // Maybe<number>
```

### just

```typescript
function just<T>(value: T): Maybe<T>;
```

Wraps value with `Maybe` monad with **Just** state.

```javascript
// We are sure that 8 is not "nothing" value.
just(8); // Maybe<number>
```

### nothing

```typescript
function nothing<T>(): Maybe<T>;
```

Creates `Maybe` monad instance with **Nothing** state.

```javascript
nothing<number>(); // Maybe<number>
```

#### Maybe

```typescript
type Maybe<V> = V extends null
  ? MaybeConstructor<V, MaybeType.Nothing>
  : V extends undefined
  ? MaybeConstructor<V, MaybeType.Nothing>
  : MaybeConstructor<V, MaybeType.Just>;
```

Monad that gets rid of `null` and `undefined`. Its methods works only if inner value is not _nothing_(`null` and `undefined`) and its state is `Just`, otherwise they aren't invoked (except `extract`). Wraps _nullable_ value and allow works with it without checking on `null` and `undefined`.
Has the same methods as `Wrapper` monad.

### isEither

```typescript
function isEither<L extends Error, R>(value: any): value is isEither<L, R>;
```

Checks if value is instance of `Either` monad.

```javascript
isEither(8); // false
isEither(eitherOf(8)); // true
```

### eitherOf

```typescript
function eitherOf<L extends Error, R>(value: R | L): Either<L, R>;
```

Wraps value with `Either` monad. Function detects state (**Right** or **Left**) of `Either` by yourself.

```javascript
eitherOf(8); // Either<Error, number>
```

### right

```typescript
function right<L extends Error, R>(value: R): Either<L, R>;
```

Wraps value with `Either` monad with **Right** state.

```javascript
// We are sure that 8 is not "left" value.
right(8); // Either<Error, number>
```

### left

```typescript
function left<L extends Error, R>(value: L): Either<L, R>;
```

Creates `Either` monad instance with **Left** state.

```typescript
left<Error, number>(new Error('Error is occured!')); // Either<Error, number>
```

#### Either

```typescript
type Either<L extends Error, R> = L | R extends Error
  ? EitherConstructor<L, R, EitherType.Left>
  : EitherConstructor<L, R, EitherType.Right>;
```

Monad that can contain value or `Error`. Allow handles errors in functional way.
Has the same methods as `Wrapper` monad and `mapLeft`, `mapRight`:

- `mapLeft<E extends Error>(fn: (value: L) => E): Either<E, R>` - maps inner value if it is an `Error` instance.
- `mapRight<A>(fn: (value: R) => A): Either<L, A>` - maps inner value if it is not an `Error` instance. Same as `map`.
