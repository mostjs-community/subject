import {Stream} from 'most'
import {MulticastSource} from '@most/multicast'
import {Observer} from './Observer'
import {replay} from './Replay'

function create(hold, bufferSize, initialValue) {
  const observer = new Observer()
  const stream = hold ?
    replay(bufferSize, new Stream(observer)) :
    new Stream(new MulticastSource(observer))

  stream.drain()

  if (typeof initialValue !== 'undefined') {
    observer.next(initialValue)
  }

  return {stream, observer}
}

function subject() {
  return create(false, 0)
}

function holdSubject(bufferSize = 1, initialValue) {
  if (bufferSize < 1) {
    throw new Error('First argument to holdSubject is expected to be an ' +
      'integer greater than or equal to 1')
  }
  return create(true, bufferSize, initialValue)
}

export {subject, holdSubject}
