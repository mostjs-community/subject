import { Scheduler, Stream } from '@most/types'
import { Test, describe, given, it } from '@typed/test'
import { currentTime, newDefaultScheduler } from '@most/scheduler'
import { never, runEffects, tap, until } from '@most/core'

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

  given(`(Stream<A>) => Stream<B>`, [
    it(`returns [Sink<A>, Stream<B>]`, ({ equal }) => {
      const values = [1, 2, 3]
      const scheduler = newDefaultScheduler()
      const [sink, stream] = create()

      setTimeout(function() {
        values.forEach(n => sink.event(currentTime(scheduler), n))
        sink.end(currentTime(scheduler))
      }, 0)

      return collectEvents(scheduler, stream).then(equal(values))
    }),
  ]),

  it(`does not notify previous observer after error`, ({ same }, done) => {
    const scheduler = newDefaultScheduler()
    const [sink, stream] = create<Error>()

    const expected = new Error()

    runEffects(
      tap(() => done(new Error('Should not propagate')), stream),
      scheduler
    ).catch(err => same(expected, err) && done())

    setTimeout(() => {
      sink.error(currentTime(scheduler), expected)
      sink.event(currentTime(scheduler), void 0)
    }, 0)
  }),

  it(`does not notify previous observer after end`, ({ equal }) => {
    const scheduler = newDefaultScheduler()
    const [sink, stream] = create<Error>()

    const promise = collectEvents(scheduler, stream)

    setTimeout(() => {
      sink.end(currentTime(scheduler))
      sink.event(currentTime(scheduler), new Error('Should not propagate'))
    }, 0)

    return promise.then(equal([]))
  }),

  it(`allows new observers after error`, ({ equal }) => {
    const scheduler = newDefaultScheduler()
    const [sink, stream] = create<number>()

    sink.error(currentTime(scheduler), new Error())

    const expected = 1
    const promise = collectEvents(scheduler, stream)

    setTimeout(() => {
      sink.event(currentTime(scheduler), expected)
      sink.end(currentTime(scheduler))
    }, 0)

    return promise.then(equal([expected]))
  }),

  it(`allows new observers after end`, ({ equal }) => {
    const scheduler = newDefaultScheduler()
    const [sink, stream] = create<number>()

    sink.end(currentTime(scheduler))

    const expected = 1
    const promise = collectEvents(scheduler, stream)

    setTimeout(() => {
      sink.event(currentTime(scheduler), expected)
      sink.end(currentTime(scheduler))
    }, 0)

    return promise.then(equal([expected]))
  }),

  it(`supports being used as a signal`, ({ ok }, done) => {
    const scheduler = newDefaultScheduler()
    const stream = never()
    const [sink, signal] = create()

    const next = () => sink.event(currentTime(scheduler), {})

    const observeUntilSignal = () =>
      runEffects(until(signal, stream), scheduler)

    observeUntilSignal()
      .then(() => {
        const promiseToEnd = observeUntilSignal()
        next()
        return promiseToEnd
      })
      .then(() => ok(true) && done())
      .catch(done)

    next()
  }),
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
