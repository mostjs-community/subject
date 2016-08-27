import { Stream, never, multicast } from 'most';
import { MulticastSource } from '@most/multicast';

import { Subject } from './Subject';
import { HoldSource } from './HoldSource';

export { Subject };

// create a Subject 
export function subject<T>(): Subject<T> {
  return asSubject<T>(never());
}

// upgrade a stream to be a Subject
export function asSubject<T>(stream: Stream<T>): Subject<T> {
  return new Subject<T>(multicast(stream).source as MulticastSource<T>);
}

// create a HoldSubject
export function holdSubject<T>(bufferSize: number = 1): Subject<T> {
  if (bufferSize <= 0) {
    throw new Error('bufferSize must be an integer greater than or equal to 1');
  }
  return asHoldSubject<T>(never(), bufferSize);
}

// upgrade a stream to be a HoldSubject
export function asHoldSubject<T>(stream: Stream<T>, bufferSize: number = 1): Subject<T> {
  return new Subject<T>(new HoldSource<T>(
    stream.source instanceof MulticastSource
      ? (stream.source as any).source
      : stream.source
    , bufferSize
  ));
}
