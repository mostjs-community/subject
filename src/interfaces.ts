import { Sink, Source, Stream } from 'most';

import { HoldSubjectSource } from './sources/HoldSubjectSource';

export interface Subject<T> extends Stream<T> {
  source: Source<T> & Sink<T>;

  next (value: T): Subject<T>;
  error (error: any): Subject<T>;
  complete (value?: T): Subject<T>;
}

export interface HoldSubject<T> extends Subject<T> {
  source: HoldSubjectSource<T>;

  next (value: T): HoldSubject<T>;
  error (error: any): HoldSubject<T>;
  complete (value?: T): HoldSubject<T>;
}
