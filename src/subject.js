import {Stream} from 'most'
import MulticastSource from 'most/lib/source/MulticastSource'

function Subscription() {
  this.run = (sink, scheduler) => this._run(sink, scheduler)
}

Subscription.prototype._run = function run(sink, scheduler) {
  this.sink = sink
  this.scheduler = scheduler
  this.active = true
  return this
}

Subscription.prototype.dispose = function dispose() {
  this.active = false
}

Subscription.prototype.add = function add(x) {
  if (!this.active) {
    return
  }
  try {
		this.sink.event(this.scheduler.now(), x)
	} catch(e) {
		this.sink.error(this.scheduler.now(), e)
	}
}

Subscription.prototype.error = function error(e) {
  this.active = false
  this.sink.error(this.scheduler.now(), e)
}

Subscription.prototype.end = function end(x) {
  if (!this.active) {
    return
  }
  this.active = false
  try {
    this.sink.end(this.scheduler.now(), x)
  } catch (e) {
    this.sink.error(this.scheduler.now(), x)
  }
}

function create() {
  const sink = new Subscription()
  const stream = new Stream(new MulticastSource(sink))
  return {sink, stream}
}

export default create
