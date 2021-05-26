# @fluss/core

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Library for functional coding in modern environment.

## Design goals

- Get the most from TypeScript's inference power.
- The implementation of each function should be as minimal as possible.
- All functions are immutable, and there are no side-effects.
- All functions must be safe as much as possible.
- Do not override native methods, if function will make same work and produce result same as native method.
- Each function is maximally independent module (I try my best, though there can be some dependencies).

## Example use

```typescript
const curriedFn /*: Curried<[left: string, right: string], string> */ = curry(
  (left: string, right: string) => left + right
);
const curriedFn2 /*: Curried<[right: string], string> */ = curriedFn('');
const result /*: string */ = curriedFn2('');
```

## @fluss/core's advantages

- TypeScript included out the box
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

### pipe

```typescript
function pipe<
  T extends readonly [
    (...args: ReadonlyArray<any>) => any,
    ...ReadonlyArray<(arg: any) => any>
  ]
>(
  ...fns: T
) => (
  ...args: Parameters<First<T>>
): IsComposable<T> extends false
  ? unknown
  : HasPromise<ReturnTypesOf<T>> extends true
  ? ReturnType<Last<T>> extends Promise<infer U>
    ? Promise<U>
    : Promise<ReturnType<Last<T>>>
  : ReturnType<Last<T>>;
```

Compose functions from left to right. Can handle asynchronous functions along with synchronous ones.

```typescript
const fn /*: (str: string) => string */ = pipe(
  (str) => str + 2,
  (str: string) => str + 3
);
const result /*: '123' */ = fn('1');

const composed /* Promise<number> */ = pipe(
  async (str: string) => str + 2,
  parseInt
);
const asyncResult /* Promise<number> */ = composed('1');
```

### once

```typescript
interface OnceFunction {
  <T extends ReadonlyArray<unknown>, R>(fn: (...args: T) => R): (
    ...args: T
  ) => Option<R>;
  <T extends ReadonlyArray<unknown>, R>(
    fn: (...args: T) => R,
    after: (...args: T) => R
  ): (...args: T) => R;
}
```

Execute _fn_ only once. And then _after_ function if it is provided.

```typescript
const doOnlyOnce = once(() => {
  /* Initialize something. */
});
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
  (str1: string, str2: string) => str1 + str2 + 3
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

### sequentially

```typescript
function sequentially<
  V extends ReadonlyArray<(...values: ReadonlyArray<any>) => unknown>
>(
  ...fns: V
): (
  ...values: IsParametersEqual<V> extends true
    ? Parameters<First<V>>
    : ReadonlyArray<unknown>
) => HasPromise<ExtractReturnTypes<V>> extends true ? Promise<void> : void;
```

Lets invoke independently functions with the same value in order that they are declared. Can handle asynchronous functions.

```typescript
function sendOverNetwork(error: Error): Promise<void> {
  // sends error to some url
}

function logIntoFile(error: Error): Promise<void> {
  // writes error to file
}

const errorLogger /*: (value: Error) => Promise<void> */ = sequentially(
  sendOverNetwork // 1
  logIntoFile, // 2
  console.log, // 3
);

errorLogger(someError);
```

### isNothing

```typescript
function isNothing<T>(value: T | Nothing): value is Nothing;
```

Checks if value is `null` or `undefined`.

```typescript
const y /*: boolean */ = isNothing(null);
const y1 /*: boolean */ = isNothing(false);
const y2 /*: boolean */ = isNothing(0);
```

### isJust

```typescript
function isJust<T>(value: T): value is Just<T>;
```

Checks if value is not `null` and `undefined`.

```typescript
const y /*: boolean */ = isJust(null);
const y1 /*: boolean */ = isJust(false);
const y2 /*: boolean */ = isJust(0);
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

### throttle

```ts
function throttle<F extends (...args: ReadonlyArray<unknown>) => void>(
  fn: F,
  frames?: number
): F;
```

Delays function invocation based on number of frames (one frame is about _16.67ms_). It ensures that function will be executed after this time. By default, it delays function with two frames.

```ts
const cpuHeavyFunction = throttle(() => {
  /* Do some heavy stuff. */
}, 4);

document.addEventListener('scroll', cpuHeavyFunction);
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
function freeze<T extends object, D extends boolean = false>(
  value: T,
  deep?: D
): D extends true ? DeepReadonly<T> : Readonly<T>;
```

Perform shallow(_deep_ is `false`) or deep(_deep_ is `true`) freeze of object. By default function does shallow freezing.

```typescript
const frozenObject /*: Readonly<{ hello: () => void }> */ = freeze({
  hello() {
    console.log('Hello world');
  },
});
const deepFrozenObject /*: DeepReadonly<{ hello: () => void }> */ = freeze(
  {
    hello() {
      console.log('Hello world');
    },
  },
  true
);
```

### wrap

```typescript
function wrap<T>(value: T): Container<T>;
```

Wraps value in `Container` monad and allow perform on it operations in chainable way.

```typescript
wrap(1)
  .map((num) => num + '0')
  .chain((str) => wrap(parseInt(str)))
  .apply(wrap((num) => Math.pow(num, 2)))
  .extract(); // => 100
```

### isContainer

```typescript
function isContainer<T>(value: unknown): value is Container<T>;
```

Check if value is instance of Container.

```typescript
isContainer(wrap(1)); // true
isContainer(1); // false
```

#### Container

Monad that contains value and allow perform operation on it by set of methods.

1. `map<R>(fn: (value: T) => R): Container<R>` - maps inner value and returns new `Container` instance with new value.

2. `chain<R>(fn: (value: T) => Container<R>): Container<R>` - the same as `map`, but function must return already wrapped value.

3. `apply<R>(other: Container<(value: T) => R>): Container<R>` - maps value by using value of `other` wrapper. Value of other wrapper must be a function type.

4. `extract(): T` - expose inner value to outside.

> These methods have also `Option` and `Either` monads.

### isOption

```typescript
function isOption<T>(value: any): value is Option<T>;
```

Checks if value is instance of `Option` monad.

```typescript
isOption(8); // false
isOption(maybe(8)); // true
```

### maybe

```typescript
function maybe<T>(
  value: T
): unknown extends T ? Option<T> : T extends Just<T> ? Some<T> : None;
```

Wraps value with `Option` monad. Function detects state (**Just** or **Nothing**) of `Option` by yourself.

```typescript
maybe(8); // Some<number>
maybe(null); // None
```

### some

```typescript
function some<T>(value: T): Some<T>;
```

Creates `Option` monad instance with **Just** state.

```typescript
some(2); // Some<number>
```

### none

```typescript
const none: None;
```

`Option`' monad's instance with **Nothing** state.

```typescript
const a /*: None */ = none;
```

#### Option

Monad that gets rid of `null` and `undefined`. Its methods works only if inner value is not _nothing_(`null` and `undefined`) and its state is `Just`, otherwise they aren't invoked (except `extract` and `fill`). Wraps _nullable_ value and allow works with it without checking on `null` and `undefined`.

### isEither

```typescript
function isEither<L extends Error, R>(value: any): value is isEither<L, R>;
```

Checks if value is instance of `Either` monad.

```typescript
isEither(8); // false
isEither(either(8)); // true
```

### right

```typescript
function right<R>(value: R): Right<R>;
```

Wraps value with `Either` monad with **Right** state.

```typescript
// We are sure that 8 is not "left" value.
right(8); // Right<number>
```

### left

```typescript
function left<L>(value: L): Left<L>;
```

Creates `Either` monad instance with **Left** state.

```typescript
left<Error>(new Error('Error is occured!')); // Left<Error>
```

### either

```typescript
function either<A, B>(
  isRight: (value: A | B) => value is B,
  value: A | B
): Either<A, B>;
```

Lift _value_ into `Either` monad. _isRight_ parameter helps find out if _value_ must belong to `Right` or `Left` type.

```typescript
const result /*: Either<Error, string> */ = either(
  isString,
  new Error('I am a value')
);
```

#### Either

Monad that can contain success value or failure value. Allow handle errors in functional way.

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

Monad that allow to perform some actions asynchronously and deferred in time (in opposite `Promise` that starts doing job immediately after definition).

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

### lazy

```typescript
function lazy<F, L>(value: Operation<F, L> | Lazy<F, L>): Lazy<F, L>;
```

Creates `Lazy` monad with some operation or from another `Lazy` instance.

```typescript
const lazyPower /*: Lazy<number, number> */ = lazy((num: number) =>
  Math.pow(num, 2)
);
```

#### Lazy

Monad that constructs and compose operations over some value. Similar to `pipe` function, but allows more comprehensive transformation of intermediate values.

### tuple

```typescript
function tuple<T extends ReadonlyArray<unknown>>(...args: T): Tuple<T>;
```

Creates `Tuple` from set of elements.

```typescript
const y /*: Tuple<[number, string]> */ = tuple(9, 'state');

// Tuple can be destructured
const [num, str] = y;
```

#### Tuple

Immutable container for fixed sequence of values.

### stream

```typescript
function stream<T>(): Stream<T>;
```

Creates live empty stream.

```typescript
const y /*: Stream<number> */ = stream<number>();

y.map((value) => Math.pow(value, 2)).listen(
  (value) => (document.body.innerHTML = value)
);

// Somewhere in the code
y.send(2); // document.body.innerHTML will be equal to 4
```

#### Stream

Structure that makes operations with values over time in live mode.

### idle

```typescript
function idle<T>(fn: () => T): Idle<T>;
```

Queues a data returned by `fn` to be evaluated at interpretator's idle period.

```typescript
const value /*: Idle<boolean> */ = idle(() => 1).map((num) => num > 7);
// somewhere in the code
const evaluated /*: boolean */ = value.extract();
```

#### Idle

Monad that allow to defer data initialization.

### reviver

```typescript
function reviver(
  key: string,
  value: JSONValueTypes | SerializabledObject<unknown>
):
  | JSONValueTypes
  | List<unknown>
  | Idle<unknown>
  | Option<unknown>
  | Container<unknown>
  | Either<Error, unknown>
  | Tuple<ReadonlyArray<unknown>>;
```

Add recognition of `Container`, `Idle`, `Tuple`, `Option`, `List`, `Either` data structures for `JSON.parse`.

```typescript
const obj = JSON.parse('{"type":"Some","value":1}', reviver);
// obj will be instance of Option type.
```

## Word from author

Have fun ✌️
