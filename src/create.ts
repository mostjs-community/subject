import { AttachSink } from './types'
import { ProxyStream } from './ProxyStream'
import { Stream } from '@most/types'

export function create<A = any>(): [AttachSink<A>, Stream<A>]
export function create<A, B>(f: (stream: Stream<A>) => B): [AttachSink<A>, B]

export function create<A, B = Stream<A>>(
  f?: (stream: Stream<A>) => B
): [AttachSink<A>, B] {
  const source = new ProxyStream()

  return [source, f === void 0 ? (source as any) as B : f(source)]
}
