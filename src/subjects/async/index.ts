import { Stream, Source, Sink, never, defaultScheduler, PropagateTask } from 'most';
import { MulticastSource } from '@most/multicast';

import { Subject } from '../../interfaces';

export function async <T> (): AsyncSubject<T> {
  return asAsync<T>(never());
}

export function asAsync <T> (stream: Stream<T>): AsyncSubject<T> {
  return new AsyncSubject<T>(new MulticastSource(stream.source));
}

export class AsyncSubject<T> extends Stream<T> implements Subject<T> {
  public source: Source<T> & Sink<T>;

  constructor (source: Source<T> & Sink<T>) {
    super(source);
  }

  public next (value: T) {
    defaultScheduler.asap(PropagateTask.event(value, this.source));
    return this;
  }

  public error <Err extends Error> (err: Err) {
    defaultScheduler.asap(PropagateTask.error(err, this.source));
    return this;
  }

  public complete (value?: T) {
    defaultScheduler.asap(PropagateTask.end(value as T, this.source));
    return this;
  }
}
