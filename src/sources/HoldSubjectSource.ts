import { Sink, Source, defaultScheduler } from 'most';
import { MulticastSource } from '@most/multicast';
import { append, drop } from '@most/prelude';

export class HoldSubjectSource<T> extends MulticastSource<T> {
  protected has: boolean = false;
  protected buffer: Array<T> = [];
  protected bufferSize: number;

  constructor (source: Source<T>, bufferSize: number) {
    super(source);
    this.bufferSize = bufferSize;
  }

  public add (sink: Sink<T>) {
    if (this.has) {
      pushEvents(this.buffer, sink);
    }

    return super.add(sink);
  }

  public event (time: number, value: T) {
    this.has = true;
    this.buffer = dropAndAppend(value, this.buffer, this.bufferSize);

    return super.event(time, value);
  }
}

function pushEvents<T> (buffer: Array<T>, sink: Sink<T>) {
  const length = buffer.length;

  for (let i = 0; i < length; ++ i) {
    sink.event(defaultScheduler.now(), buffer[i]);
  }
}

export function dropAndAppend<T> (value: T, buffer: T[], bufferSize: number) {
  if (buffer.length === bufferSize) {
    return append(value, drop(1, buffer));
  }

  return append(value, buffer);
}
