# most-subject

Subjects for [`@most/core`](https://github.com/mostjs/core)

## Get it
```sh
yarn add most-subject
# or
npm install --save most-subject
```

## API Documentation

#### create\<A\>(): [AttachSink\<A\>, Stream\<A\>]
#### create\<A, B\>(f: (stream: Stream\<A\>) =\> B): [AttachSink\<A\>, B]

Returns an tuple containing a `Sink` and a `Stream`. `Sink` can be 
used to imperatively control the events following through the `Stream`. 
Optionally a function can be applied to `Stream` and the return value of that 
function will be returned as the second tuple value. 

<details>
  <summary>See an example</summary>
  
```typescript
import { create, event } from 'most-subject'
import { runEffects, propagateEventTask } from '@most/core'
import { newDefaultScheduler, currentTime } from '@most/scheduler'

// Create a new `Scheduler` for use in our application.
// Usually you will want to only have 1 scheduler and should be shared across 
// your application
const scheduler = newDefaultScheduler()

// create our sink and our stream
// NOTE: stream is the resulting value of tap(console.log, stream)
const [ sink, stream ] = create(tap<number>(console.log))

// Pushes events into our stream
const next = (n: number) => event(currentTime(scheduler), n, sink)

// activate our stream
runEffects(stream, scheduler)

// simulate asynchronous data fetching
// and then push values into our stream
Promise.resolve([ 1, 2, 3 ])
 .then(data => data.forEach(next))
```

</details>

#### attach\<A\>(attachSink: AttachSink\<A\>, stream: Stream\<A\>): Stream\<A\>

Allow for creating circular dependencies with additional logic to help avoid 
memory leaks.  

WARNING: There is no logic for breaking infinite loops

<details>
  <summary>See an example</summary>

```typescript
import { Stream } from '@most/types'
import { create, attach } from 'most-subject'
import { periodic, scan, take, runEffects } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'

// Create a new Scheduler for use in our application.
// Usually you will want to only have 1 scheduler and should be shared across 
// your application
const scheduler = newDefaultScheduler()

const [ sink, stream ] = create<number>()

// listen to our stream
// will log "1", "2", and "3"
runEffects(tap(console.log, stream), scheduler)

const origin = scan(x => x + 1, 0, periodic(100))

attach(origin)
```

</details>

#### event\<A\>(time: Time, value: A, sink: Sink\<A\>): void

A curried function for calling `Sink.event(time, value)`

#### error(time: Time, error: Error, sink: Sink\<any\>): void

A curried function for calling `Sink.error(time, error)`

#### end(time: Time, sink: Sink\<any\>): void

A curried function for calling `Sink.end(time)`

#### AttachSink\<A\>

```typescript
import { Sink } from '@most/types'

export AttachSink<A> extends Sink<A> {
  attach(stream: Stream<A>): Stream<A>
}
```
