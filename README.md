# most-subject

Subjects for [`@most/core`](https://github.com/mostjs/core)

## Get it
```sh
yarn add most-subject
# or
npm install --save most-subject
```

## API Documentation


#### create\<A\>(): [Sink\<A\>, Stream\<A\>]
#### create\<A, B\>(f: (stream: Stream\<A\>) =\> B): [Sink\<A\>, B]

Returns an tuple containing a `Sink` and a `Stream`. `Sink` can be 
used to imperatively control the events following through the `Stream`. 
Optionally a function can be applied to `Stream` and the return value of that 
function will be returned as the second tuple value. 

<details>
  <summary>See an example</summary>
  
```typescript
import { create } from 'most-subject'
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
const event = (n: number) => sink.event(currentTime(scheduler), n)

// activate our stream
runEffects(stream, scheduler)

// simulate asynchronous data fetching
// and then push values into our stream
Promise.resolve([ 1, 2, 3 ])
 .then(data => data.forEach(event))
```

</details>
