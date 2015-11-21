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

  add(x) {
    if (!this.active) {
      return
    }
    tryEvent(this.scheduler.now(), x, this.sink)
  }

  error(x) {
    this.active = false
	  this.sink.error(this.scheduler.now(), x)
  }

  end(x) {
    if (!this.active) {
      return
    }
    tryEnd(this.scheduler.now(), x, this.sink)
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
