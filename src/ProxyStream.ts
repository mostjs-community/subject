import { Disposable, Scheduler, Sink, Stream, Time } from '@most/types'
import { MulticastSource, never } from '@most/core'

export class ProxyStream<A> extends MulticastSource<A> {
  public attached: boolean = false
  public running: boolean = false
  public scheduler: Scheduler

  constructor() {
    super(never())
  }

  public run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    this.scheduler = scheduler
    this.add(sink)

    const shouldRun = this.attached && !this.running

    if (shouldRun) {
      this.running = true
      this.disposable = this.source.run(this, scheduler)

      return this.disposable
    }

    return new ProxyDisposable(this, sink)
  }

  public attach(stream: Stream<A>): Stream<A> {
    if (this.attached) throw new Error('Can only attach 1 stream')

    this.attached = true
    this.source = stream

    const hasMoreSinks = this.sinks.length > 0

    if (hasMoreSinks) this.disposable = stream.run(this, this.scheduler)

    return stream
  }

  public error(time: Time, error: Error): void {
    this.cleanup()

    super.error(time, error)
  }

  public end(time: number): void {
    this.cleanup()

    super.end(time)
  }

  private cleanup() {
    this.attached = false
    this.running = false
  }
}

class ProxyDisposable<A> implements Disposable {
  private source: ProxyStream<A>
  private sink: Sink<A>
  private disposed: boolean

  constructor(source: ProxyStream<A>, sink: Sink<A>) {
    this.source = source
    this.sink = sink
    this.disposed = false
  }

  public dispose() {
    if (this.disposed) return

    const { source, sink } = this

    this.disposed = true
    const remainingSinks = source.remove(sink)
    const hasNoMoreSinks = remainingSinks === 0

    return hasNoMoreSinks && source.dispose()
  }
}
