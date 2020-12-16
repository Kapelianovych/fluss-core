# @fluss/core

Library for functional coding in modern environment.

## Design goals

- Manual annotation should never be required, TypeScript should infer everything by self.
- The implementation of each function should be as minimal as possible.
- All functions are immutable, and there are no side-effects.
- All functions must be safe as much as possible.
- Do not override native methods, if function will make same work and produce result same as native method.
- Each function is maximally independent module (we try our best, though there can be some dependencies).

## Example use

```typescript
const curriedFn /*: Curried<[left: string, right: string], string> */ = curry(
  (left: string, right: string) => left + right
);
const curriedFn2 /*: Curried<[right: string], string> */ = curriedFn('');
const result /*: string */ = curriedFn2('');
```

## @fluss/core's advantages

- TypeScript included

TypeScript definitions are included in the library.

- Small size

- Separated modules. You can import only needed functions into your code.

## Install

```sh
npm i @fluss/core
```

## Import

```js
import { curry } from '@fluss/core';
// or
import { curry } from '@fluss/core/curry';
```

## API

Library is bundled as bunch of _ES modules_. It doesn't support _CommonJS_. If you need old module system, transform code with any tool (`Babel` etc.).

> In TypeScript's examples is used [Flow](https://flow.org)'s comment notation if TypeScript infer type by yourself.

### compose

```typescript
function compose<T extends ReadonlyArray<(...args: ReadonlyArray<any>) => any>>(
  ...fns: T
): (...args: Parameters<Last<T>>) => ReturnType<T[0]>;
```

Compose functions from right to left.

```typescript
const fn /*: (str: string) => string */ = compose(
  (str) => str + 3,
  (str: string) => str + 2
);
const result /*: '123' */ = fn('1');
```

### curry

```typescript
function curry<P extends ReadonlyArray<unknown>, R>(
  fn: (...args: P) => R
): Curried<P, R>;
```

Create curried version of function with optional partial application.

```typescript
const fn /*: Curried<[str1: string, str2: string], string> */ = curry(
  (str1, str2) => str1 + str2 + 3
);
```

### fork

```typescript
function fork<T extends ReadonlyArray<unknown>, R>(
  join: (...args: ReadonlyArray<any>) => R,
  ...fns: ReadonlyArray<(...args: T) => unknown>
): (...args: T) => R;
```

Allow join output of two functions that get the same input and process it in a different way.

```typescript
// Compute average.
const y /*: (a: Array<number>) => number */ = fork(
  (sum: number, count: number) => sum / count,
  (a: Array<number>) => a.reduce((sum, num) => sum + num, 0),
  (a: Array<number>) => a.length
);
```

### alternation

```typescript
function alternation<T extends ReadonlyArray<unknown>, R>(
  ...fns: ReadonlyArray<(...args: T) => R>
): (...args: T) => Maybe<R>;
```

Lets accomplish condition logic depending of function application.
If function returns `NaN`, `null` or `undefined`, then result of next function is checked.
If all functions return empty value, then result of last function is returned.

```typescript
const y /*: (a: number) => Maybe<number> */ = alternation(
  (sum: number) => sum - 3,
  (sum: number) => sum // As default value if first function returns NaN
);
```

### sequence

```typescript
function sequence<V>(
  ...fns: ReadonlyArray<(value: V) => unknown>
): (value: V) => void;
```

Lets invoke independent functions with the same value in order that they are declared.

```typescript
function sendOverNetwork(error: Error) {
  // send error to some url
}

const errorLogger /*: (value: Error) => void */ = sequence(
  console.log, // 1
  logIntoFile, // 2
  sendOverNetwork // 3
);

errorLogger(someError);
```

### isNothing

```typescript
function isNothing<T>(value: T | null | undefined): value is undefined | null;
```

Checks if value is `null` or `undefined`.

```typescript
const y /*: true */ = isNothing(null);
const y1 /*: false */ = isNothing(false);
const y2 /*: false */ = isNothing(0);
```

### isError

```typescript
function isError<E extends Error>(
  value: any,
  childClass?: Constructor<E>
): value is E;
```

Checks if value is `Error` or its extended classes.

```typescript
const y /*: false */ = isError(null);
const y1 /*: true */ = isError(new Error('message'));
const y2 /*: true */ = isError(new TypeError('message'), TypeError);
const y2 /*: false */ = isError(new Error('message'), TypeError);
```

### isPromise

```typescript
function isPromise<T>(value: any): value is Promise<T>;
```

Checks if value is `Promise`.

```typescript
const y /*: false */ = isPromise(false);
const y1 /*: true */ = isPromise(Promise.resolve(9));
```

### promise

```typescript
function promise<T>(value: T | PromiseLike<T>): Promise<T>;
```

Creates new resolved promise if value is not an error, otherwire returns rejected promise.

```typescript
const y /*: Promise<9> */ = promise(9);

function throwable() {
  throw new Error();
}
const y1 /*: Promise<never> */ = promise(throwable());
```

### array

```typescript
function array<T>(
  ...iterables: ReadonlyArray<T | ArrayLike<T> | Iterable<T>>
): ReadonlyArray<T>;
```

Creates readonly array from set of ArrayLike, iterable objects or values.

```typescript
const y /*: ReadonlyArray<number> */ = array(9, new Set([6]), {
  0: 6,
  length: 1,
});
```

### tuple

```typescript
function tuple<T extends ReadonlyArray<unknown>>(...args: T): readonly [...T];
```

Creates readonly tuple from set of elements.

```typescript
const y /*: readonly [number, string] */ = tuple(9, 'state');
```

### tryCatch

```typescript
function tryCatch<T, L extends Error, R>(
  tryFn: (input: T) => R,
  catchFn?: (error: L) => R
): (input: T) => Either<L, R>;
```

Wraps code into `try/catch` and returns `Either` monad with result. If `catchFn` is not `undefined`, then `Either` with result will be returned, otherwise - `Either` with error. Asyncronous version is also existed.

```typescript
const getUser /*: (id: string) => Either<NoUserError, User> */ = tryCatch(
  (id: string) => getUserFromDbById(id),
  (error: NoUserError) => createUser()
);
```

### freeze

```typescript
function freeze<T extends object>(value: T, deep?: boolean): Readonly<T>;
```

Perform shallow(_deep_ is `false`) or deep(_deep_ is `true`) freeze of object. By default function does shallow freezing.

```typescript
const frozenObject /*: Readonly<{ hello: () => void }> */ = freeze({
  hello() {
    console.log('Hello world');
  },
});
```

### wrap

```typescript
function wrap<T>(value: T | Wrapper<T>): Wrapper<T>;
```

Wraps value in `Wrapper` monad and allow perform on it operations in chainable way.

```typescript
wrap(1)
  .map((num) => num + '0')
  .chain((str) => wrap(parseInt(str)))
  .apply(wrap((num) => Math.pow(num, 2)))
  .extract(); // => 100
```

### isWrapper

```typescript
function isWrapper<T>(value: any): value is Wrapper<T>;
```

Check if value is instance of Wrapper.

```typescript
isWrapper(wrap(1)); // true
isWrapper(1); // false
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

```typescript
isMaybe(8); // false
isMaybe(maybe(8)); // true
```

### maybe

```typescript
function maybe<T>(value: T | Maybe<T>): Maybe<T>;
```

Wraps value with `Maybe` monad. Function detects state (**Just** or **Nothing**) of `Maybe` by yourself.

```typescript
maybe(8); // Maybe<number>
```

### just

```typescript
function just<T>(value: T): Maybe<T>;
```

Creates `Maybe` monad instance with **Just** state.

```typescript
just(2); // Maybe<number>
```

### nothing

```typescript
function nothing<T = unknown>(): Maybe<T>;
```

Creates `Maybe` monad instance with **Nothing** state.

```typescript
nothing(); // Maybe<unknown>
nothing<number>(); // Maybe<number>
```

#### Maybe

Monad that gets rid of `null` and `undefined`. Its methods works only if inner value is not _nothing_(`null` and `undefined`) and its state is `Just`, otherwise they aren't invoked (except `extract`). Wraps _nullable_ value and allow works with it without checking on `null` and `undefined`.
Has the same methods as `Wrapper` monad.

### isEither

```typescript
function isEither<L extends Error, R>(value: any): value is isEither<L, R>;
```

Checks if value is instance of `Either` monad.

```typescript
isEither(8); // false
isEither(either(8)); // true
```

### either

```typescript
function either<L extends Error, R>(value: L | R | Either<L, R>): Either<L, R>;
```

Wraps value with `Either` monad. Function detects state (**Right** or **Left**) of `Either` by yourself.

```typescript
either(8); // Either<Error, number>
```

### right

```typescript
function right<L extends Error, R>(value: R): Either<L, R>;
```

Wraps value with `Either` monad with **Right** state.

```typescript
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

Monad that can contain value or `Error`. Allow handles errors in functional way.
Has the same methods as `Wrapper` monad and `mapLeft`, `mapRight`:

- `mapLeft<E extends Error>(fn: (value: L) => E | R): Either<E, R>` - maps inner value if it is an `Error` instance.
- `mapRight<A>(fn: (value: R) => A): Either<L, A>` - maps inner value if it is not an `Error` instance. Same as `map`.

### task

```typescript
function task<T, E extends Error>(
  fork: ForkFunction<T, E> | Task<T, E> | Promise<T>
): Task<T, E>;
```

Defines `Task` or copies fork function from another `Task` or `Promise`.

```typescript
function getSomeDataFromInternet(): Promise<string> {
  /* useful code */
}

const dataTask = task(getSomeDataFromInternet()).map(JSON.parse);

// somewhere in code
dataTask.start((data) => {
  /* do job with data */
});
// or you can convert Task to Promise and expose data
const data = await dataTask.asPromise(); // This method also starts task as `start`.
```

### done

```typescript
function done<T, E extends Error>(value: T): Task<T, E>;
```

Wraps value to process as `Task`.

```typescript
const data = {
  /* some data */
};

const dataTask = done(data).map(JSON.stringify).chain(task(sendOverInternet));

// somewhere in code
dataTask.start(
  () => {
    /* on done job */
  },
  (error) => {
    /* on fail job */
  }
);
```

### fail

```typescript
function fail<T, E extends Error>(value: E): Task<T, E>;
```

Create failed `Task`.

```typescript
const dataTask = fail(someError);

// somewhere in code
dataTask.start(
  () => {
    /* on done job */
  },
  (error) => {
    /* on fail job */
  }
);
```

### isTask

```typescript
function isTask<T, E extends Error>(value: any): value is Task<T, E>;
```

Check if value is instance of `Task`.

```typescript
const dataTask = done(8);

isTask(dataTask); // true
```

#### Task

Monad that allow to perform some actions asyncrounously and deferred in time (in opposite `Promise` that start doing job immediately after definition).

[Difference between Task and Promise.](https://glebbahmutov.com/blog/difference-between-promise-and-task/)

### list

```typescript
function list<T>(
  ...values: ReadonlyArray<T | ArrayLike<T> | Iterable<T>>
): List<T>;
```

Create `List` from values, array-like objects or iterables.

```typescript
const numbers /*: List<number> */ = list(1, new Set([2]), [3]);
```

### iterate

```typescript
function iterate<T>(fn: IteratorFunction<T>): List<T>;
```

Create `List` from function that returns iterator.

```typescript
const numbers /*: List<number> */ = iterate(function* () {
  yield 1;
  yield 2;
  yield 3;
});
```

### isList

```typescript
function isList<T>(value: any): value is List<T>;
```

Checks if value is instance of `List`.

```typescript
const result /*: boolean */ = isList(list());
```

#### List

Monad that represents lazy `Array`. It can decrease computation step comparingly to `Array`. Actual execution of `List`'s methods starts when one of _terminating method_ (method that do not return List instance) is called.
