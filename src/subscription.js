class Subscription {

  constructor() {}

  run(sink, scheduler) {
    this.sink = sink
    this.scheduler = scheduler
    this.active = true
    return this
  }

  dispose() {
    this.active = false
  }

  next(x) { // ES7 Naming
    if (!this.active) {
      return
    }
    tryEvent(this.scheduler.now(), x, this.sink)
  }

  add(x) { // Current Most naming
    this.next(x)
  }

  error(x) { // ES7 Naming
    this.active = false
	  this.sink.error(this.scheduler.now(), x)
  }

  complete(x) { // ES7 Naming
    if (!this.active) {
      return
    }
    tryEnd(this.scheduler.now(), x, this.sink)
  }

  end(x) { // Current Most naming
    this.complete(x)
  }
}

function tryEvent(t, x, sink) {
	try {
		sink.event(t, x);
	} catch(e) {
		sink.error(t, e);
	}
}

function tryEnd(t, x, sink) {
	try {
		sink.end(t, x);
	} catch(e) {
		sink.error(t, e);
	}
}

export default Subscription
