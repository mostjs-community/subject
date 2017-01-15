import { HoldSubject, Subject } from '../interfaces';

import { curry2 } from '@most/prelude';

export const next: NextFn = curry2(
  function next (value: any, subject: Subject<any> | HoldSubject<any>) {
    return (subject as any).next(value);
  },
);

export interface NextFn {
  <T>(value: T, holdSubject: HoldSubject<T>): HoldSubject<T>;
  <T>(vlaue: T, subject: Subject<T>): Subject<T>;
  <T>(value: T): CurriedNextFn<T>;

  (value: any, holdSubject: HoldSubject<any>): HoldSubject<any>;
  (value: any, subject: Subject<any>): Subject<any>;
  (value: any): CurriedNextFn<any>;
}

export interface CurriedNextFn<T> {
  (holdSubject: HoldSubject<T>): HoldSubject<T>;
  (subject: Subject<T>): Subject<T>;
}
