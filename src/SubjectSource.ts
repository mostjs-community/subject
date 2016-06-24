import {Source, Sink, Scheduler, Disposable} from 'most';
import {SubjectDisposable} from './SubjectDisposable';
import {tryEvent, tryEnd, append, remove, findIndex} from './util';

declare var require: any;
const defaultScheduler = require('most/lib/scheduler/defaultScheduler');

export interface SubjectSource<T> extends Source<T> {
  next: (value: T) => void;
  error: (err: Error) => void;
  complete: (value?: T) => void;
}

export class BasicSubjectSource<T> implements SubjectSource<T> {
  protected scheduler: Scheduler = defaultScheduler;
  protected sinks: Sink<T>[] = [];
  protected active: boolean = false;

  run (sink: Sink<T>, scheduler: Scheduler): Disposable<T> {
    const n = this.add(sink);
    if (n === 1) {
      this.scheduler = scheduler;
      this.active = true;
    }
    return new SubjectDisposable<T>(this, sink);
  }

  protected add (sink: Sink<T>) {
    this.sinks = append(sink, this.sinks);
    return this.sinks.length;
  }

  remove (sink: Sink<T>) {
    const i = findIndex(sink, this.sinks);
    if (i >= 0) {
      this.sinks = remove(i, this.sinks);
    }

    return this.sinks.length;
  }

  _dispose () {
    this.active = false;
  }

  next (value: T): void {
    if (!this.active || this.scheduler === void 0) return;
    this._next(this.scheduler.now(), value);
  }

  error (err: Error): void {
    if (!this.active || this.scheduler === void 0) return;

    this._dispose();
    this._error(this.scheduler.now(), err);
  }

  complete (value?: T): void {
    if (!this.active || this.scheduler === void 0) return;

    this._dispose();
    this._complete(this.scheduler.now(), value);
  }

  protected _next (time: number, value: T) {
    const s = this.sinks;
    if (s.length === 1) {
      return s[0].event(time, value);
    }
    for (let i = 0; i < s.length; ++i) {
      tryEvent(time, value, s[i]);
    }
  }

  protected _complete (time: number, value: T) {
    const s = this.sinks;
    for (let i = 0; i < s.length; ++i) {
      tryEnd(time, value, s[i]);
    }
  }

  protected _error (time: number, err: Error) {
    const s = this.sinks;
    for (let i = 0; i < s.length; ++i) {
      s[i].error(time, err);
    }
  }
}
