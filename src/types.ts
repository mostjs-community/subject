import { Sink, Stream } from '@most/types'

export type Subject<A, B> = [Sink<A>, Stream<B>]

export interface AttachSink<A> extends Sink<A> {
  attach(source: Stream<A>): Stream<A>
}
