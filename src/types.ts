import { Sink, Stream } from '@most/types'

export interface AttachSink<A> extends Sink<A> {
  attach(source: Stream<A>): Stream<A>
}
