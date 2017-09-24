import { Sink, Time } from '@most/types'

import { curry3 } from '@most/prelude'

export const event: EventFn = curry3(__event)

function __event<A>(time: Time, value: A, sink: Sink<A>): void {
  sink.event(time, value)
}

export type EventFn = {
  <A>(time: Time, value: A, sink: Sink<A>): void
  <A>(time: Time, value: A): (sink: Sink<A>) => void
  (time: Time): {
    <A>(value: A, sink: Sink<A>): void
    <A>(value: A): (sink: Sink<A>) => void
  }
}
