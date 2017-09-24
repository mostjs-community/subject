import { MulticastSource, never } from '@most/core'
import { Sink, Stream } from '@most/types'

export function create<A = any>(): [Sink<A>, Stream<A>]
export function create<A, B>(operator: (stream: Stream<A>) => B): [Sink<A>, B]

export function create<A, B = Stream<A>>(
  f?: (stream: Stream<A>) => B
): [Sink<A>, B] {
  const source = new MulticastSource(never())

  return [source, f === void 0 ? (source as any) as B : f(source)]
}
