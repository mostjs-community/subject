import { Sink, Source } from 'most';
import { MulticastSource } from '@most/multicast';

export class HoldSource<T> extends MulticastSource<T> {
  private buffer: Array<{ time: number, value: T }>;
  private bufferSize: number;
  constructor(source: Source<T>, bufferSize?: number) {
    super(source);
    this.buffer = [];
    this.bufferSize = bufferSize || 1;
  }

  add(sink: Sink<T>) {
    if (this.buffer.length > 0) {
      replayEvents(this.buffer, sink);
    }
    return super.add(sink);
  }

  event(time: number, value: T) {
    this.buffer = pushEvent(time, value, this.buffer, this.bufferSize);
    return super.event(time, value);
  }

  end(time: number, value: T) {
    return super.end(time, value);
  }
}

function pushEvent<T>(time: number, value: T, buffer: Array<{ time: number, value: T }>, bufferSize: number) {
  return buffer.length >= 1
    ? buffer.concat({ time, value }).slice(-bufferSize)
    : buffer.concat({ time, value });
}

function replayEvents<T>(buffer: Array<{ time: number, value: T }>, sink: Sink<T>) {
  const length = buffer.length;
  for (let i = 0; i < length; ++i) {
    playEvent(buffer[i], sink);
  }
}

function playEvent<T> ({ time, value }: {time: number, value: T}, sink: Sink<T>) {
  sink.event(time, value);
}
