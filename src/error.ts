import { Sink, Time } from '@most/types'

import { curry3 } from '@most/prelude'

export const error: ErrorFn = curry3(__error)

export type ErrorFn = {
  (time: Time, error: Error, sink: Sink<any>): void
  (time: Time, error: Error): (sink: Sink<any>) => void
  (time: Time): {
    (error: Error, sink: Sink<any>): void
    (error: Error): (sink: Sink<any>) => void
  }
}

function __error(time: Time, error: Error, sink: Sink<any>): void {
  sink.error(time, error)
}
