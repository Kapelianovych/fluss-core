# @fluss/core

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Library for functional coding in the modern environment.

## Design goals

- Get the most from TypeScript's inference power.
- The implementation of each function should be as minimal as possible.
- Respect the immutability.
- All functions must be safe as much as possible.
- Do not override native methods, if function will make same work and produce result same as native method.
- Each function is maximally independent module (I try my best, though there can be some dependencies).

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

Library embraces a lot of _ES modules_. It doesn't support _CommonJS_. If you need old module system, transform code with any tool (`Babel` etc.).

### pipe

Compose functions from left to right. Can handle asynchronous functions along with synchronous ones.

```typescript
const fn /*: (str: string) => string */ = pipe(
  (str) => str + 2,
  (str: string) => str + 3,
);
const result /*: '123' */ = fn('1');

const composed /* Promise<number> */ = pipe(
  async (str: string) => str + 2,
  parseInt,
);
const asyncResult /*: Promise<number> */ = composed('1');
```

### identity

Returns own argument back to the calling place.

```ts
const value = 5;

const result /*: 5 */ = identity(value);
```

### once

Execute _fn_ only once. And then _after_ function if it is provided.

```typescript
const doOnlyOnce = once(() => {
  /* Initialize something. */
});
```

### flip

Reverses function's parameters.

```ts
const fn = (s: string, n: number) => Number(s) + n;

const flipped /*: (args_0: number, args_1: string) => number */ = flip(fn);

// ...

flipped(1, '2'); // -> 3
```

### curry

Create curried version of function with optional partial application. If function accepts variadic arguments (...rest), then you can apparently define function's _arity_.

```typescript
const fn /*: Curried<(arg_0: string, arg_1: string) => string, 2> */ = curry(
  (str1: string, str2: string) => str1 + str2 + 3,
);
```

There is a special value `_` that you can use with curried function to preserve place for an argument for the next function execution.

```ts
// _anotherFn_ will accept first parameter from original _fn_ function.
const anotherFn /*: Curried<(arg_0: string) => string, 1> */ = fn(_, '2');
```

### binary

Creates function for binary operation. For unknown operator it returns tuple with left and right operands.

```ts
const sum = [1, 2, 3, 4, 5, 6].reduce(binary('+'), 0);
```

### isJust

Checks if value is not `null` and `undefined`.

```typescript
const y /*: boolean */ = isJust(null);
const y1 /*: boolean */ = isJust(false);
const y2 /*: boolean */ = isJust(0);
```

### isError

Checks if value is `Error` or its extended classes.

```typescript
const y /*: false */ = isError(null);
const y1 /*: true */ = isError(new Error('message'));
const y2 /*: true */ = isError(new TypeError('message'), TypeError);
const y3 /*: false */ = isError(new Error('message'), TypeError);
```

### isPromise

Checks if value is `Promise`.

```typescript
const y /*: false */ = isPromise(false);
const y1 /*: true */ = isPromise(Promise.resolve(9));
```

### isFunction

Check if _value_ is a function.

```ts
const f: unknown = () => 2;

if (isFunction<() => number>(f)) {
  // `f` will be type of () => number here.
}
```

### throttle

Makes function be executed once per _frames_ count. If _frames_ argument is equal to `0` or less, then, if present, `requestAnimationFrame` is used. Otherwise, `setTimeout` function is in use.

```ts
const cpuHeavyFunction = throttle(() => {
  /* Do some heavy stuff. */
}, 4);

document.addEventListener('scroll', cpuHeavyFunction);
```

### consequent

Executes function while it is not in process. It can handle asynchronous functions.

```ts
const consequentFunction = consequent((...args) => {
  /* Some work here */
});

consequentFunction(); // Start doing the job.
consequentFunction(); // If previous invocation is not completed then this is ignored.
```

### debounce

Delays function invocation for _frames_ from last invocation of debounced function. If interval between invocations will be less than _frames_ time, then original function won't be executed.

```ts
const debouncedFunction = debounce((event: ScrollEvent) => {
  /* Some work here */
}, 2);

// It starts job when you finish scrolling.
window.addEventListener('scroll', debouncedFunction);
```

### delay

Delays function invocation by some frames. If _frames_ equals to zero or less, then `requestAnimationFrame` function is used.

```ts
delay(() => {
  /* Some work here. */
}); // Will use `requestAnimationFrame` in browser.
const stamp = delay(() => {
  /* Some another work here. */
}, 2); // Will use `setTimeout`.

stamp.canceled; // -> false
stamp.result; // -> Promise<T> holds result if delayed function.
stamp.cancel(); // -> cancels delay.
```

### memoize

Wraps function and cache all execution results. Allows to customize key for cache. By default, it is first function's argument. Cache readable object is visible to outside.

```ts
const fn = (num: number) => Math.random() * num;
const memoizedFn = memoize(fn);

const result1 = memoizedFn(1); // Function is executed
const result2 = memoizedFn(1); // Value from cache will be returned
const result3 = memoizedFn(4); // Function is executed

// Allows manually clear cache.
memoizedFn.cache.clear();
```

### tap

Performs side effect on value while returning it as is. It does not wait for side effect callback to be finished.

```ts
const result /*: 5 */ = tap(console.log)(5);
```

### awaitedTap

Performs side effect on value while returning it as is. It waits for side effect callback to be finished.

```ts
const result /*: 5 */ = awaitedTap(prepareListenerForTheValue)(5);
```

### when

Replaces conditional flow (ternary operator and `if`/`else`).

```ts
const multiplyIf = when((num: number) => num > 10)((num) => num * 3, identity);

const result /*: number */ = multiplyIf(9); // Will be returned as is.
const result2 /*: number */ = multiplyIf(11); // Will be multiplied.
```

### isOption

Checks if value is instance of `Option` monad.

```typescript
isOption(8); // false
isOption(Some(8)); // true
```

### Some

Creates the `Option` monad instance with the **Just** state.

```typescript
Some(2); // Option<number>
```

### None

`Option` with the **Nothing** state.

```typescript
const a /*: None */ = None;
```

#### Option

Monad that gets rid of `null` and `undefined`. Its methods work only if inner value is not _nothing_(`null` and `undefined`) and its state is `Just`, otherwise they aren't invoked (except `extract` and `fill`). Wraps _nullable_ value and allows to work with it without checking on `null` and `undefined`.

### isResult

Checks if value is instance of `Result` monad.

```typescript
isResult(8); // false
isResult(Ok(8)); // true
```

### Ok

Wraps a value with the `Result` monad with the **Right** state.

```typescript
// We are sure that 8 is not "left" value.
Ok(8); // Result<number, never>
```

### Err

Creates the `Result` monad instance with the **Left** state.

```typescript
Err(new Error('Error is occurred!')); // Result<never, Error>
```

### tryExecute

Runs function and return a result wrapped in the `Result` monad.

```typescript
const result /*: Either<Error, string> */ = tryExecute(() => {
  if (someVariable > 3) {
    return someVariable; // the Ok will be returned.
  } else {
    throw new Error('The variable is less than 3.'); // the Err will be returned.
  }
});
```

#### Result

Monad that can contain success value or failure value. Allow handle errors in functional way.

### Task

Defines the `Task` monad or copies fork function from another `Task` or `Promise`.

```typescript
function getSomeDataFromInternet(): Promise<string> {
  /* useful code */
}

const dataTask = Task(getSomeDataFromInternet()).map(JSON.parse);

// Runs the task and returns the Promise with the Result.
// The returned Promise never throws, so you don't have wrap it with try/catch.
const data = await dataTask.run();
```

### Succeed

Wraps value to process as `Task`.

```typescript
const data = {
  /* some data */
};

const dataTask = Succeed(data)
  .map(JSON.stringify)
  .chain(Task(sendOverInternet));

// somewhere in the code
dataTask.run();
```

### Fail

Create a failed `Task`.

```typescript
const dataTask = Fail(someError);

// somewhere in code
dataTask.run();
```

### isTask

Check if a value is instance of the `Task`.

```typescript
const dataTask = Succeed(8);

isTask(dataTask); // true
```

#### Task

Monad that allow to perform some actions asynchronously and deferred in time (in opposite `Promise` that starts doing job immediately after definition).

[Difference between Task and Promise.](https://glebbahmutov.com/blog/difference-between-promise-and-task/)

### List

Create the `List` from values, array-like objects or iterables.

```typescript
const numbers /*: List<number> */ = List(1, new Set([2]), [3]);
```

### iterate

Create the `List` from function that returns iterator.

```typescript
const numbers /*: List<number> */ = iterate(function* () {
  yield 1;
  yield 2;
  yield 3;
});
```

### isList

Checks if value is instance of the `List`.

```typescript
const result /*: boolean */ = isList(List());
```

#### List

Monad that represents lazy `Array`. It can decrease computation step comparably to `Array`. Actual execution of `List`'s methods starts when one of _terminating method_ (method that do not return a new `List` instance) is called.

### Stream

Creates a live empty stream.

```typescript
const y /*: Stream<number, number> */ = Stream((value: number) => Math.pow(value, 2));

y.forEach((value) => (document.body.innerHTML = value));

// Somewhere in the code
y.send(2); // document.body.innerHTML will set to equal to 4
```

#### Stream

Structure that makes operations with values over time in live mode.

### Idle

Queues a data returned by `fn` to be evaluated at interpreter's idle period.

```typescript
const value /*: Idle<boolean> */ = Idle(() => 1).map((num) => num > 7);
// somewhere in the code
const evaluated /*: boolean */ = value.extract();
```

#### Idle

Monad that allow to defer data initialization.

### reviver

Add recognition of `Idle`, `Option`, `List` and `Result` data structures for `JSON.parse`.

```typescript
const obj = JSON.parse('{"type":"__$Option","value":1}', reviver);
// obj will be instance of Option type.
```

## Word from author

Have fun ✌️
