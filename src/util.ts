import {Sink} from 'most';
import {SubjectEvent} from './HoldSubjectSource';

export function tryEvent<T> (t: number, x: T, sink: Sink<T>) {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

export function tryEnd<T> (t: number, x: T, sink: Sink<T>) {
  try {
    sink.end(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

export function pushEvents<T> (buffer: any[], sink: Sink<T>) {
  for (let i = 0; i < buffer.length; ++i) {
    const {time, value} = buffer[i];
    sink.event(time, value);
  }
}

export function dropAndAppend<T> (event: SubjectEvent<T>, buffer: SubjectEvent<T>[], bufferSize: number) {
  if (buffer.length === bufferSize) {
    return append(event, drop(1, buffer));
  }
  return append(event, buffer);
}

function append<T> (x: T, a: T[]): T[] {
  const l = a.length;
  const b = new Array(l + 1);
  for (let i = 0; i < l; ++i) {
    b[i] = a[i];
  }

  b[l] = x;
  return b;
}

function drop<T> (n: number, a: T[]): T[] { // eslint-disable-line complexity
  if (n < 0) {
    throw new TypeError('n must be >= 0');
  }

  const l = a.length;
  if (n === 0 || l === 0) {
    return a;
  }

  if (n >= l) {
    return [];
  }

  return unsafeDrop<T>(n, a, l - n);
}

// unsafeDrop :: Int -> [a] -> Int -> [a]
// Internal helper for drop
function unsafeDrop<T> (n: number, a: T[], l: number): T[] {
  const b = new Array(l);
  for (let i = 0; i < l; ++i) {
    b[i] = a[n + i];
  }
  return b;
}
