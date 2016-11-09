import { curry2 } from '@most/prelude';

import { Subject, HoldSubject } from '../interfaces';

export const next: NextFn = curry2<any, Subject<any> | HoldSubject<any>, Subject<any> | HoldSubject<any>>(
  function next (value: any, subject: Subject<any> | HoldSubject<any>) {
    return (subject as any).next(value);
  }
) as NextFn;

export interface NextFn {
  (value: any, subject: Subject<any> | HoldSubject<any>): Subject<any> | HoldSubject<any>;
  <T>(value: T, subject: Subject<T> | HoldSubject<T>): Subject<T> | HoldSubject<T>;

  (value: any): CurriedNextFn<any>;
  <T>(value: T): CurriedNextFn<T>;
}

export interface CurriedNextFn<T> {
  (subject: Subject<T> | HoldSubject<T>): Subject<T> | HoldSubject<T>;
}
