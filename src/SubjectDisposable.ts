import {Sink, Disposable} from 'most';
import {BasicSubjectSource} from './SubjectSource';

export class SubjectDisposable<T> implements Disposable<T> {
  private disposed: boolean = false;
  constructor (private source: BasicSubjectSource<T>, private sink: Sink<T>) {
  }

  dispose () {
    if (this.disposed) return;
    this.disposed = true;
    const remaining = this.source.remove(this.sink);
    return remaining === 0 && this.source._dispose();
  }
}
