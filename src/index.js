import {Stream} from 'most'
import MulticastSource from 'most/lib/source/MulticastSource'
import {Subscription} from './Subscription'
import {replay as replayStream} from './ReplaySource'
import hold from '@most/hold'

const defaults = {
  replay: false,
  bufferSize: 1
}

function create(replay, bufferSize, initialValue) {
  const sink = new Subscription()
  let stream;

  if (!replay) {
    stream = new Stream(new MulticastSource(sink))
  } else {
    stream = bufferSize === 1 ?
      hold(new Stream(sink)) :
      replayStream(new Stream(sink), bufferSize)
  }

  stream.drain()

  if (typeof initialValue !== 'undefined') {
    sink.next(initialValue)
  }

  return {sink, stream, observer: sink}
}

function subject(initialValue) {
  return create(false, 1, initialValue)
}

function holdSubject(bufferSize = 1, initialValue) {
  return create(true, bufferSize, initialValue)
}

export {subject, holdSubject}
