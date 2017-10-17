import { Sink, Time } from '@most/types'

import { curry2 } from '@most/prelude'

export const end: EndFn = curry2(__end)

function __end(time: Time, sink: Sink<any>): void {
  sink.end(time)
}

export type EndFn = {
  (time: Time, sink: Sink<any>): void
  (time: Time): (sink: Sink<any>) => void
}
