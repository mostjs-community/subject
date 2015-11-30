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

function tryEvent(sink, scheduler, event) {
  try {
		sink.event(scheduler.now(), event)
	} catch(e) {
		sink.error(scheduler.now(), e)
	}
}

Subscription.prototype.add = function add(x) {
  if (!this.active) {
    return
  }
  tryEvent(this.sink, this.scheduler, x)
}

Subscription.prototype.error = function error(e) {
  this.active = false
  this.sink.error(this.scheduler.now(), e)
}

function tryEnd(sink, scheduler, event) {
  try {
    sink.end(scheduler.now(), event)
  } catch (e) {
    sink.error(scheduler.now(), e)
  }
}

Subscription.prototype.end = function end(x) {
  if (!this.active) {
    return
  }
  this.active = false
  tryEnd(this.sink, this.scheduler, x)
}

function create() {
  const sink = new Subscription()
  const stream = new Stream(new MulticastSource(sink))
  return {sink, stream}
}

export default create
