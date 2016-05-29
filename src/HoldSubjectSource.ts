import {Sink} from 'most';

import {BasicSubjectSource} from './SubjectSource';
import {pushEvents, dropAndAppend} from './util';

export interface SubjectEvent<T> {
  time: number;
  value: T;
}

export class HoldSubjectSource<T> extends BasicSubjectSource<T> {
  protected bufferSize: number;
  protected buffer: SubjectEvent<T>[] = [];
  constructor (bufferSize: number) {
    super();
    this.bufferSize = bufferSize;
  }

  add(sink: Sink<T>): number {
    const buffer = this.buffer;
    if (buffer.length > 0) {
      pushEvents(buffer, sink);
    }
    return super.add(sink);
  }

  next (value: T) {
    if (!this.active || this.scheduler === void 0) { return; }
    const time = this.scheduler.now();
    this.buffer = dropAndAppend({time, value}, this.buffer, this.bufferSize);
    this._next(time, value);
  }
}
