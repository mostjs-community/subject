import {Stream} from 'most';

import {BasicSubjectSource, SubjectSource} from './SubjectSource';
import {HoldSubjectSource} from './HoldSubjectSource';

export {SubjectSource};

export function subject<T>() {
  return new Subject<T>(new BasicSubjectSource<T>());
}

export function holdSubject<T>(bufferSize: number = 1) {
  if (bufferSize <= 0) {
    throw new Error('bufferSize must be an integer 1 or greater');
  }
  return new Subject<T>(new HoldSubjectSource<T>(bufferSize));
}

export class Subject<T> extends Stream<T> {
  constructor(source: SubjectSource<T>) {
    super(source);
  }

  next (value: T) {
    (<SubjectSource<T>> this.source).next(value);
  }

  error(err: Error) {
    (<SubjectSource<T>> this.source).error(err);
  }

  complete(value: T) {
    (<SubjectSource<T>> this.source).complete(value);
  }
}
