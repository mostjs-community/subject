import { Scheduler, Stream } from '@most/types'
import { Test, describe, given, it } from '@typed/test'
import { currentTime, newDefaultScheduler } from '@most/scheduler'
import { runEffects, tap } from '@most/core'

import { create } from './create'

export const test: Test = describe(`create`, [
  it(`returns [Sink<A>, Stream<A>]`, ({ equal }) => {
    const values = [1, 2, 3]
    const scheduler = newDefaultScheduler()
    const [sink, stream] = create<number>()

    const promise = collectEvents(scheduler, stream)

    values.forEach(n => sink.event(currentTime(scheduler), n))
    sink.end(currentTime(scheduler))

    return promise.then(equal(values))
  }),

  given(`(Stream<A>) => B`, [
    it(`returns [Sink<A>, B]`, ({ equal }) => {
      const values = [1, 2, 3]
      const scheduler = newDefaultScheduler()
      const [sink, promise] = create((stream: Stream<number>) =>
        collectEvents<number>(scheduler, stream)
      )

      values.forEach(n => sink.event(currentTime(scheduler), n))
      sink.end(currentTime(scheduler))

      return promise.then(equal(values))
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
