import { Scheduler, Stream } from '@most/types'
import { Test, describe, given, it } from '@typed/test'
import {
  at,
  delay,
  map,
  mergeArray,
  runEffects,
  startWith,
  take,
  tap,
} from '@most/core'

import { attach } from './attach'
import { create } from './create'
import { newDefaultScheduler } from '@most/scheduler'

export const test: Test = describe(`attach`, [
  given(`Sink<A> and Stream<A>`, [
    it(`creates a circular dependency`, ({ equal }) => {
      const expected = [0, 1, 2]

      const scheduler = newDefaultScheduler()
      const [sink, sut] = create<number>()
      const stream = mergeArray<number>(expected.map(x => at(x, x)))

      const promise = collectEvents(scheduler, sut)

      attach(sink, stream)

      return promise.then(equal(expected))
    }),

    it(`does not have a memory leak`, ({ notOk }, done) => {
      const scheduler = newDefaultScheduler()
      const [sink, stream] = create<number>()

      function makeAssertions(currentValue: number) {
        if (currentValue === 8) Promise.resolve(void 0).then(done)

        notOk(currentValue > 8)
      }

      const origin = map(x => x * 2, startWith(1, tap(makeAssertions, stream)))

      runEffects(take(3, attach(sink, delay(10, origin))), scheduler)
    }),

    it(`allows reattaching after completion`, ({ ok }) => {
      const scheduler = newDefaultScheduler()
      const [sink, stream] = create<number>()

      const drain = <A>(stream: Stream<A>) => runEffects(stream, scheduler)

      const origin = mergeArray<number>([0, 1, 2].map(x => at(x, x)))

      attach(sink, origin)

      return drain(stream)
        .then(() => attach(sink, origin))
        .then(drain)
        .then(() => ok(true))
    }),
  ]),
])

function collectEvents<A>(
  scheduler: Scheduler,
  stream: Stream<A>
): Promise<Array<A>> {
  const events: Array<A> = []

  return runEffects(tap(x => events.push(x), stream), scheduler).then(
    () => events
  )
}
