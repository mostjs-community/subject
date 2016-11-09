import { curry2 } from '@most/prelude';

import { Subject, HoldSubject } from '../interfaces';
import { HoldSubjectSource } from '../sources';

export const hold: HoldFn = curry2(
  function hold <T> (bufferSize: number, subject: Subject<T>): HoldSubject<T> {
    return new (subject as any).constructor(
      new HoldSubjectSource(subject.source, bufferSize)
    );
  }
);

export interface HoldFn {
  (bufferSize: number): (subject: Subject<any>) => HoldSubject<any>;
  <T> (bufferSize: number): (subject: Subject<T>) => HoldSubject<T>;

  (bufferSize: number, subject: Subject<any>): HoldSubject<any>;
  <T> (bufferSize: number, subject: Subject<T>): HoldSubject<T>;
}
