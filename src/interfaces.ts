import { Stream, Source, Sink } from 'most';

import { HoldSubjectSource } from './sources/HoldSubjectSource';

export interface Subject<T> extends Stream<T> {
  source: Source<T> & Sink<T>;

  next (value: T): Subject<T>;
  error <Err extends Error> (err: Err): Subject<T>;
  complete (value?: T): Subject<T>;
}

export interface HoldSubject<T> extends Subject<T> {
  source: HoldSubjectSource<T>;

  next (value: T): HoldSubject<T>;
  error <Err extends Error> (err: Err): HoldSubject<T>;
  complete (value?: T): HoldSubject<T>;
}
