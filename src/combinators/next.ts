import { curry2 } from '@most/prelude';

import { Subject, HoldSubject } from '../interfaces';

export const next: NextFn = curry2<any, Subject<any> | HoldSubject<any>, Subject<any> | HoldSubject<any>>(
  function next (value: any, subject: Subject<any> | HoldSubject<any>) {
    return (subject as any).next(value);
  }
) as NextFn;

export interface NextFn {
  (value: any, holdSubject: HoldSubject<any>): HoldSubject<any>;
  (value: any, subject: Subject<any>): Subject<any>;

  <T>(value: T, holdSubject: HoldSubject<T>): HoldSubject<T>;
  <T>(vlaue: T, subject: Subject<T>): Subject<T>;

  (value: any): CurriedNextFn<any>;
  <T>(value: T): CurriedNextFn<T>;
}

export interface CurriedNextFn<T> {
  (holdSubject: HoldSubject<T>): HoldSubject<T>;
  (subject: Subject<T>): Subject<T>;
}
