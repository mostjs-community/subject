function tryEvent(sink, scheduler, event) {
  try {
    sink.event(scheduler.now(), event)
  } catch (err) {
    sink.error(scheduler.now(), err)
  }
}

function tryEnd(sink, scheduler, event) {
  try {
    sink.end(scheduler.now(), event)
  } catch (err) {
    sink.error(scheduler.now(), err)
  }
}

class Observer {
  constructor() {
    this.run = (sink, scheduler) => this._run(sink, scheduler)
    this.next = x => this._next(x)
    this.error = err => this._error(err)
    this.complete = x => this._complete(x)
  }

  _run(sink, scheduler) {
    this.sink = sink
    this.scheduler = scheduler
    this.active = true
    return this
  }

  dispose() {
    this.active = false
  }

  _next(value) {
    if (!this.active) {
      return
    }
    tryEvent(this.sink, this.scheduler, value)
  }

  _error(err) {
    this.active = false
    this.sink.error(this.scheduler.now(), err)
  }

  _complete(value) {
    if (!this.active) {
      return
    }
    this.active = false
    tryEnd(this.sink, this.scheduler, value)
  }
}

export {Observer}
