import { Source, Sink, Stream } from 'most';
import * as defaultScheduler from 'most/lib/scheduler/defaultScheduler';
import PropagateTask = require('most/lib/scheduler/PropagateTask');

export class Subject<T> extends Stream<T> {
  public source: Source<T> & Sink<T>;
  constructor(source: Source<T> & Sink<T>) {
    super(source);
  }

  next (value: T) {
    defaultScheduler.asap(PropagateTask.event(value, this.source));
  }

  error(err: Error) {
    defaultScheduler.asap(PropagateTask.error(err, this.source));
  }

  complete(value?: T) {
    defaultScheduler.asap(PropagateTask.end(value, this.source));
  }
}
