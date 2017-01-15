import { HoldSubject, Subject } from '../interfaces';

import { curry2 } from '@most/prelude';

export const complete: CompleteFn = curry2(
  function complete (value: any, subject: Subject<any> | HoldSubject<any>) {
    return (subject as any).complete(value);
  },
);

export interface CompleteFn {
  <T>(value: T, holdSubject: HoldSubject<T>): HoldSubject<T>;
  <T>(value: T, subject: Subject<T>): Subject<T>;
  <T>(value: T): CurriedCompleteFn<T>;

  (value: any, holdSubject: HoldSubject<any>): HoldSubject<any>;
  (value: any, subject: Subject<any>): Subject<any>;
  (value: any): CurriedCompleteFn<any>;
}

export interface CurriedCompleteFn<T> {
  (holdSubject: HoldSubject<T>): HoldSubject<T>;
  (subject: Subject<T>): Subject<T>;
}
