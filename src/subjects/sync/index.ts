import { Stream, Source, Sink, never, defaultScheduler as scheduler } from 'most';
import { MulticastSource } from '@most/multicast';

import { Subject } from '../../interfaces';

export function sync <T> (): SyncSubject<T> {
  return asSync<T>(never());
}

export function asSync <T> (stream: Stream<T>): SyncSubject<T> {
  return new SyncSubject<T>(new MulticastSource(stream.source));
}

export class SyncSubject<T> extends Stream<T> implements Subject<T> {
  public source: Source<T> & Sink<T>;

  constructor (source: Source<T> & Sink<T>) {
    super(source);
  }

  public next (value: T) {
    this.source.event(scheduler.now(), value);
    return this;
  }

  public error <Err extends Error> (err: Err) {
    this.source.error(scheduler.now(), err);
    return this;
  }

  public complete (value?: T) {
    this.source.end(scheduler.now(), value as T);
    return this;
  }
}
