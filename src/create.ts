import { ProxyStream } from './ProxyStream'
import { Stream } from '@most/types'
import { Subject } from './types'
import { id } from '@most/prelude'

export function create<A = any>(): Subject<A, A>
export function create<A, B>(f: (stream: Stream<A>) => Stream<B>): Subject<A, B>

export function create<A, B = A>(
  f: (stream: Stream<A>) => Stream<B> = id as (stream: Stream<A>) => Stream<B>
): Subject<A, B> {
  const source = new ProxyStream<A>()

  return [source, f(source)]
}
