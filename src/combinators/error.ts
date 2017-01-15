import { HoldSubject, Subject } from '../interfaces';

import { curry2 } from '@most/prelude';

export const error: ErrorFn = curry2(
  function error <Err extends Error> (err: Err, subject: Subject<any> | HoldSubject<any>) {
    return (subject as any).error(err);
  },
);

export interface ErrorFn {
  <T>(err: any, holdSubject: HoldSubject<T>): HoldSubject<T>;
  <T>(err: any, subject: Subject<T>): Subject<T>;
  <T>(err: any): CurriedErrorFn<T>;

  (err: any, holdSubject: HoldSubject<any>): HoldSubject<any>;
  (err: any, subject: Subject<any>): Subject<any>;
  (err: any): CurriedErrorFn<any>;
}

export interface CurriedErrorFn<T> {
  (holdSubject: HoldSubject<T>): HoldSubject<T>;
  (subject: Subject<T>): Subject<T>;
}
