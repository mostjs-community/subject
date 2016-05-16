/* @flow */
import {Subject} from './Subject'
import {SubjectSource} from './source/SubjectSource'
import {HoldSubjectSource} from './source/HoldSubjectSource'

/**
 * Creates a new Subject
 *
 * @return {Subject} {@link Subject}
 *
 * @example
 * import {subject} from 'most-subject'
 *
 * const stream = subject()
 *
 * stream.map(fn).observe(x => console.log(x))
 * // 1
 * // 2
 *
 * stream.next(1)
 * stream.next(2)
 * setTimeout(() => stream.complete(), 10)
 */
export function subject (): Subject {
  return new Subject(new SubjectSource())
}

/**
 * Create a subject with a buffer to keep from missing events.
 *
 * @param  {number}    bufferSize =             1 The maximum size of the
 * buffer to create.
 *
 * @return {Subject} {@link Subject}
 *
 * @example
 * import {holdSubject} from 'most-subject'
 *
 * const stream = holdSubject(3)
 *
 * stream.next(1)
 * stream.next(2)
 * stream.next(3)
 *
 * stream.map(fn).observe(x => console.log(x))
 * // 1
 * // 2
 * // 3
 *
 * setTimeout(() => stream.complete(), 10)
 */
export function holdSubject (bufferSize: number = 1): Subject {
  if (bufferSize <= 0) {
    throw new Error('First and only argument to holdSubject `bufferSize` ' +
      'must be an integer 1 or greater')
  }
  return new Subject(new HoldSubjectSource(bufferSize))
}
