import { AttachSink } from './types'
import { ProxyStream } from './ProxyStream'
import { Stream } from '@most/types'
import { id } from '@most/prelude'

export function create<A = any>(): [AttachSink<A>, Stream<A>]
export function create<A, B>(f: (stream: Stream<A>) => B): [AttachSink<A>, B]

export function create<A, B = A>(
  f: (stream: Stream<A>) => Stream<B> = id as (stream: Stream<A>) => Stream<B>
): [AttachSink<A>, Stream<B>] {
  const source = new ProxyStream<A>()

  return [source, f(source)]
}
