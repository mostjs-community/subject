import {Stream} from 'most'
import MulticastSource from 'most/lib/source/MulticastSource'

function pushEvents(sink, buffer) {
  let i = 0
  for (; i < buffer.length; ++i) {
    let item = buffer[i]
    sink.event(item.time, item.value)
  }
}

function replayAdd(sink) {
  const length = this._replayAdd(sink)
  if (this._replay.buffer.length > 0) {
    pushEvents(sink, this._replay.buffer)
  }
  return length
}

function addToBuffer(event, replay) {
  if (replay.buffer.length >= replay.bufferSize) {
    replay.buffer.shift()
  }
  replay.buffer.push(event)
}

function replayEvent(time, value) {
  if (this._replay.bufferSize > 0) {
    addToBuffer({time, value}, this._replay)
  }
  this._replayEvent(time, value)
}

class Replay {
  constructor(bufferSize, source) {
    this.source = source
    this.bufferSize = bufferSize
    this.buffer = []
  }

  run(sink, scheduler) {
    if (sink._replay !== this) {
      sink._replay = this
      sink._replayAdd = sink.add
      sink.add = replayAdd

      sink._replayEvent = sink.event
      sink.event = replayEvent
    }

    return this.source.run(sink, scheduler)
  }
}

const replay = (bufferSize, stream) =>
  new Stream(new MulticastSource(new Replay(bufferSize, stream.source)))

export {replay}
