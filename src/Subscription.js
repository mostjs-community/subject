class Subscription {
  constructor() {
    this.run = (sink, scheduler) => this._run(sink, scheduler)
    this.add = this.next = x => this._add(x)
    this.error = err => this._error(err)
    this.end = this.complete = x => this._end(x)
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

  _add(x) {
    if (!this.active) {
      return
    }
    tryEvent(this.sink, this.scheduler, x)
  }

  _error(e) {
    this.active = false
    this.sink.error(this.scheduler.now(), e)
  }

  _end(x) {
    if (!this.active) {
      return
    }
    this.active = false
    tryEnd(this.sink, this.scheduler, x)
  }
}

function tryEvent(sink, scheduler, event) {
  try {
		sink.event(scheduler.now(), event)
	} catch(e) {
		sink.error(scheduler.now(), e)
	}
}

function tryEnd(sink, scheduler, event) {
  try {
    sink.end(scheduler.now(), event)
  } catch (e) {
    sink.error(scheduler.now(), e)
  }
}

export {Subscription}
