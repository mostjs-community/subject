import { AttachSink } from './types'
import { ProxyStream } from './ProxyStream'
import { Stream } from '@most/types'
import { id } from '@most/prelude'

export function create<A = any>(): [AttachSink<A>, Stream<A>]
export function create<A, B>(f: (stream: Stream<A>) => B): [AttachSink<A>, B]

export function create<A, B = Stream<A>>(
  f: (stream: Stream<A>) => B = id as (stream: Stream<A>) => B
): [AttachSink<A>, B] {
  const source = new ProxyStream()

  return [source, f(source)]
}
