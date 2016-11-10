# Most Subject [![Build Status](https://travis-ci.org/mostjs-community/most-subject.svg?branch=master)](https://travis-ci.org/TylorS/most-subject) [![npm version](https://badge.fury.io/js/most-subject.svg)](https://badge.fury.io/js/most-subject)

Subject interfaces for [most](https://github.com/cujojs/most)

## API Documentation

###### **Subject**

A Subject is a normal most.js
[Stream](https://github.com/cujojs/most/wiki/Concepts#streams), with 3 added methods,
which allow for imperative calls to events, errors, and completion. This library was
created out of need for them for [motorcycle.js](https://github.com/motorcyclejs) and
the need to create circular dependencies. The original author of most.js, and I,
would strongly urge you to find a way to create a custom Stream factory using
the standard most.js architectural patterns before deferring to this library.
We would love to help you in the [most.js gitter room](https://gitter.im/cujojs/most).

You're still here? Okay, so maybe you need to use a Subject for a good reason.
I'll define the interfaces that are used by this library. The notation here is that
which is used by TypeScript. For the types that are not defined here please see
[this](https://github.com/cujojs/most/wiki/Architecture) on the most.js Architecture.

```typescript
interface Subject<T> extends Stream<T> {
  source: Source<T> & Sink<T>;

  next (value: T): Subject<T>
  error <Err extends Error> (err: Err): Subject<T>;
  complete (value?: T): Subject<T>;
}

interface HoldSubject<T> extends Subject<T> {
  source: HoldSubjectSource<T>;

  next (value: T): HoldSubject<T>
  error <Err extends Error> (err: Err): HoldSubject<T>;
  complete (value?: T): HoldSubject<T>;
}
```

Okay so here, we have the interfaces that define what a Subject *is*. It is a
Stream with a `source` property that satifies both the `Source` and `Sink` interfaces,
like that of `MulticastSource` from [`@most/multicast`](https://github.com/mostjs/multicast).
A Subject also has 3 methods `next`, `error`, and `complete`
to allow imperatively pushing values into the underlying stream.

The reason for the distinction between a Subject and a HoldSubject are solely for
TypeScript users looking for the best typings they can get :smile:

Let us take a look at some of the functions provided by this library.

### Subjects

#### `async<T>(): Subject<T>`

This function here creates a Subject, which will produce its values asynchonously.
The asynchrony is important to note here. Most.js itself ensures that **no** events
can occur while it is being instantiated via `.observe()` and related operators that
"attach" listeners.

**Example**

```typescript
import { async, Subject } from 'most-subject';

const subject: Subject<number> = async<number>();

subject.observe(x => console.log(x)) // 1, 2, 3

subject.next(1);
subject
  .next(2)
  .next(3)
  .complete();

```

#### `sync<T>(): Subject<T>`

This function here will create Subject that will emit its values synchronously.
This is provided to add backwards compatiblity with theoretical edge cases
applications may have been built on in previous versions.

```typescript
import { sync } from 'most-subject';

const subject = sync();

subject.observe(x => console.log(x)); // 1, 2, 3

subject.next(1);
subject.next(2).next(3);

// note this setTimeout will be required
// to ensure the previous events are ever emitted
setTimeout(() => subject.complete());
```

### Combinators

###### All combinators are curried.

#### `hold<T> (bufferSize: number, subject: Subject<T>): HoldSubject<T>`

This function will lift any subject, synchronous or asynchonous, into a HoldSubject.
A HoldSubject is just like a regular Subject, but it will remember values previously
emitted for any late subscribers. The number of values it will remember is based on the
bufferSize amount passed in as the first argument.

```typescript
import { sync, hold } from 'most-subject';

const holdSubject = hold(1, sync());

holdSubject.next(1);
holdSubject.next(2);

holdSubject.observe(x => console.log(x)); // 2

setTimeout(() => holdSubject.complete());
```

#### `next<T> (value: T, subject: Subject<T>): Subject<T>`

This is a functional equivalent to `subject.next(value)`. It will push a value
into a Subject.

```typescript
import { next, async } from 'most-subject';

const subject = async();

subject.observe(x => console.log(x)); // 1, 1, 2

subject.next(1);
// is equivalent to
next(1, subject);

// curried by default
const nextTwo = next(2);
nextTwo(subject);

subject.complete();
```

#### `error<T> (err: Error, subject: Subject<T>): Subject<T>`

This is a functional equivalent to `subject.error(Error)`. It will push an error
into a Subject.

```typescript
import { error, async } from 'most-subject';

const subject = async();

subject.observe(x => console.log(x));
  .catch(err => console.log(err.message))

subject.error(new Error());
// is equivalent to
error(new Error, subject);

// curried by default
const defaultError = error(new Error('default message'));
defaultError(subject);

subject.complete();
```

#### `complete<T> (value: T, subject: Subject<T>): Subject<T>`

This is a functional equivalent to `subject.complete(value)`. It will cause a
subject to complete with a particular value.

```typescript
import { complete, async } from 'most-subject';

const subject = asnyc();

subject.complete(1);
// is equivalent to
complete(1, subject);

const completeWith1 = complete(1);
completeWith1(subject);
```

### "Upgrading" streams

A new feature designed to help with manual stream debugging are 2 functions that
are able to "lift" most.js Streams into Subjects of your choice.

#### `asSync<T> (stream: Stream<T>): Subject<T>`

Lifts a stream into a synchronously emitting Subject.

```typescript
import { asSync, next } from 'most-subject';

const subject = asSync(someStream);

next(1, subject);
```

#### `asAsync<T> (stream: Stream<T>): Subject<T>`

Lifts a stream into an asynchonously emitting Subject.

```typescript
import { asAsync, next } from 'most-subject';

const subject = asAsync(somStream);

next(1, subject);
```

### Classes

####`SyncSubject`

SyncSubject is the class instance created when using `sync()` or `asSync(stream)`.
It must be istantiated using the keyword `new` and takes a single parameter
`source` which must satisfy the interfaces `Sink` and `Source`.

```typescript
import { SyncSubject } from 'most-subject'
import { MulticastSource } from '@most/multicast';
import { never } from 'most';

// this is effectively what `sync()` creates
const subject = new SyncSubject(new MulticastSource(never().source));
```

#### `AsyncSubject`

AsyncSubject is the class instance created when using `async()` or `asAsync(stream)`.
It must be istantiated using the keyword `new` and takes a single parameter
`source` which must satisfy the interfaces `Sink` and `Source`.

```typescript
import { AsyncSubject } from 'most-subject'
import { MulticastSource } from '@most/multicast';
import { never } from 'most';

// this is effectively what `async()` creates
const subject = new AsyncSubject(new MulticastSource(never().source));
```

#### `HoldSubjectSource`

HoldSubjectSource is the `source` property type of a `HoldSubject`. It is a
special case that implements both `Sink` and `Source` interfaces, that also remembers
an arbitrary number of values.
It must be istantiated using the keyword `new` and takes a two parameters.
`source` which must satisfy the interface `Source` and `bufferSize` which is of
type Number and must be an integer greater than or equal to 1.

```typescript
import { HoldSubjectSource, SyncSubject } from 'most-subject';
import { never } from 'most';

const source = new HoldSubjectSource(never().source, 1);

// effectively what hold(1, sync()) creates
const subject = new SyncSubject(source);
```
