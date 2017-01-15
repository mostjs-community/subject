import { HoldSubject, Subject } from '../interfaces';

import { HoldSubjectSource } from '../sources';
import { Stream } from 'most';
import { curry2 } from '@most/prelude';

export const hold: HoldFn = curry2(
  function hold <T> (bufferSize: number, subject: Subject<T>): HoldSubject<T> {
    return new (subject as any).constructor(
      new HoldSubjectSource(subject.source, bufferSize),
    );
  },
);

export interface HoldFn {
  <T> (bufferSize: number, subject: Subject<T>): HoldSubject<T>;
  <T>(bufferSize: number, stream: Stream<T>): Stream<T>;
  <T> (bufferSize: number): HoldFnCurried<T>;

  (bufferSize: number, subject: Subject<any>): HoldSubject<any>;
  (bufferSize: number, stream: Stream<any>): Stream<any>;
  (bufferSize: number): HoldFnCurried<any>;
}

export interface HoldFnCurried<T> {
  (bufferSize: number, subject: Subject<T>): HoldSubject<T>;
  (bufferSize: number, stream: Stream<T>): Stream<T>;
}
