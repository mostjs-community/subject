import { AttachSink } from './types'
import { Stream } from '@most/types'
import { curry2 } from '@most/prelude'

export const attach: AttachFn = curry2(__attach)

export type AttachFn = {
  <A>(sink: AttachSink<A>, stream: Stream<A>): Stream<A>
  <A>(sink: AttachSink<A>): (stream: Stream<A>) => Stream<A>
}

function __attach<A>(sink: AttachSink<A>, stream: Stream<A>): Stream<A> {
  return sink.attach(stream)
}
