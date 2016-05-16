/* @flow */
import {SubjectSource} from './SubjectSource'
import {drop, append} from '@most/prelude'

// flow-ignore-next-line: I want to extend another class
export class HoldSubjectSource extends SubjectSource {
  constructor (bufferSize: number) {
    super()
    this.bufferSize = bufferSize
    this.buffer = []
  }

  add (sink: Object) {
    const buffer = this.buffer
    if (buffer.length > 0) {
      pushEvents(buffer, sink)
    }
    super.add(sink)
  }

  next (value: any) {
    if (!this.active) { return }
    const time = this.scheduler.now()
    this.buffer = dropAndAppend({time, value}, this.buffer, this.bufferSize)
    this._next(time, value)
  }
}

function pushEvents (buffer: any[], sink: Object) {
  for (let i = 0; i < buffer.length; ++i) {
    const {time, value} = buffer[i]
    sink.event(time, value)
  }
}

function dropAndAppend (event: Object, buffer: any[], bufferSize: number) {
  if (buffer.length >= bufferSize) {
    return append(event, drop(1, buffer))
  }
  return append(event, buffer)
}
