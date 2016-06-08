# Most Subject [![Build Status](https://travis-ci.org/TylorS/most-subject.svg?branch=master)](https://travis-ci.org/TylorS/most-subject) [![npm version](https://badge.fury.io/js/most-subject.svg)](https://badge.fury.io/js/most-subject)

Subject interface for [most](https://github.com/cujojs/most)

## API Documentation

###### Apologies the documentation generator I used sucks, and gh-pages hates it. Will search for something better soon.
~~To find the API documentation follow [this link](https://tylors.github.io/most-subject/doc)!~~

## Handwitten Documentation :)

###### **Subject**

A Subject is a normal most.js
[Stream](https://github.com/cujojs/most/wiki/Concepts#streams), with 3 added methods,
which allow for imperative calls to events, errors, and completion. This library was
created out of need for them for [motorcycle.js](https://github.com/motorcyclejs) and
the need to create circular dependencies. I would strongly urge you to find a way to
create a custom Stream factory using the standard most.js architectural patterns before
deferring to this library. We would love to help you in the
[most.js gitter room](https://gitter.im/cujojs/most).

You're still here? Okay, so maybe you actually need to use a Subject for a good reason.
I'll define the interfaces that are used by this library. The notation here is that
which is used by TypeScript. For the types that are not defined here please see
[this](https://github.com/cujojs/most/wiki/Architecture) on the most.js Architecture.

```typescript
class Subject<T> extends Stream<T> {
  constructor(source: SubjectSource<T>) {
    super(source);
  }

  next (x: T) {
    this.source.next(x);
  };

  error (e: Error) {
    this.source.error(e);
  }

  complete (x?: T) {
    this.source.complete(x);
  }
}

interface SubjectSource<T> extends Source<T> {

  run (sink: Sink<T>, scheduler: Scheduler): void;

  next (x: T): void;

  error (e: Error): void;

  complete (x?: T): void;
}
```

Okay so here, we have the actual implementation of the Subject class, and the interface
it expects the `source` it is passed to look like. The actual implementation of
the `SubjectSource` is up to the developer and can do absolutely anything you desire it
to do. However, I had some ideas of what you might need by default, and have provided 2
factory functions to help you out, and they have been the basis of things I personally
have needed in practice.

*Side Note: I'm always open to suggestions and PR's are graciously appreciated please
raise and issue if there is something you've yet to find, or need help with.*

**`subject<T>(): Subject<T>`**

This is the most basic Subject provided by this library. It creates a Subject
that emits events **synchronously**. This is important to realize, because this
means that it is up to **you the developer** to take care of race conditions and
to realize that there is a possibility of missing events.

Here's a basic example of usage:
```js
import {subject} from 'most-subject'

const stream = subject()

stream
  .map(x => x * 2)
  .observe(x => console.log(x))

stream.next(1)
stream.next(2)
stream.next(3)
stream.complete()
```

Here's this example as a [webpackbin](http://www.webpackbin.com/Nk39EugE-) for you to give this quick try.

One last thing about this Subject type, is it is
[`multicast()`](https://github.com/cujojs/most/blob/master/docs/api.md#multicast)
to efficiently share this events with multiple listeners.

**`holdSubject<T>(bufferSize: number): Subject<T>`**

This is minor variation of the previous factory function. The difference here is
it creates a Subject which has an internal buffer of `bufferSize` size and will
replay the buffer to every listener to that is added. This Subject is also shared
efficiently to listeners via multicasting.

Here's a quick basic usage of this factory function

```js
const {holdSubject} from 'most-subject'

const stream = holdSubject(3)

stream.next(1)
stream.next(2)
stream.next(3)
stream.next(4)

stream.observe(x => console.log(x))
```

Do you have an idea of what this will output? Check this
[webpackbin](http://www.webpackbin.com/EJ-yudgVW) to see if you're correct!

In practice I have never needed to use a buffer size greater than 1, but implementation
of 1 event or multiple events was very similar and I went with the option to be
slightly more robust if the use case did arise for someone.

I hope this is a decent starting place for you all, feel free to raise an issue
if something is not clear or if more information should be added. PR's always
welcomed.
