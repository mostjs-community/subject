import { curry2 } from '@most/prelude';

import { Subject, HoldSubject } from '../interfaces';

export const complete: CompleteFn = curry2<any, Subject<any> | HoldSubject<any>, Subject<any> | HoldSubject<any>>(
  function complete (value: any, subject: Subject<any> | HoldSubject<any>) {
    return (subject as any).complete(value);
  }
) as CompleteFn;

export interface CompleteFn {
  (value: any, subject: Subject<any> | HoldSubject<any>): Subject<any> | HoldSubject<any>;
  <T>(value: T, subject: Subject<T> | HoldSubject<T>): Subject<T> | HoldSubject<T>;

  (value: any): CurriedCompleteFn<any>;
  <T>(value: T): CurriedCompleteFn<T>;
}

export interface CurriedCompleteFn<T> {
  (subject: Subject<T> | HoldSubject<T>): Subject<T> | HoldSubject<T>;
}
