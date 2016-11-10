import { curry2 } from '@most/prelude';

import { Subject, HoldSubject } from '../interfaces';

export const error: ErrorFn = curry2<Error, Subject<any> | HoldSubject<any>, Subject<any> | HoldSubject<any>>(
  function error <Err extends Error> (err: Err, subject: Subject<any> | HoldSubject<any>) {
    return (subject as any).error(err);
  }
) as ErrorFn;

export interface ErrorFn {
  <Err extends Error>(err: Err, holdSubject: HoldSubject<any>): HoldSubject<any>;
  <Err extends Error>(err: Err, subject: Subject<any>): Subject<any>;
  <Err extends Error, T>(err: Err, holdSubject: HoldSubject<T>): HoldSubject<T>;
  <Err extends Error, T>(err: Err, subject: Subject<T>): Subject<T>;

  <Err extends Error>(err: Err): CurriedErrorFn<any>;
  <Err extends Error, T>(err: Err): CurriedErrorFn<T>;
}

export interface CurriedErrorFn<T> {
  (holdSubject: HoldSubject<T>): HoldSubject<T>;
  (subject: Subject<T>): Subject<T>;
}
