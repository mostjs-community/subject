import {Stream} from 'most'
import MulticastSource from 'most/lib/source/MulticastSource'

function run(sink, scheduler) {
  this.sink = sink
  this.scheduler = scheduler
  this.active = true
  return this
}

function dispose() {
  this.active = false
}

function add(x) {
  if (!this.active) {
    return
  }
  try {
		this.sink.event(this.scheduler.now(), x)
	} catch(e) {
		this.sink.error(this.scheduler.now(), e)
	}
}

function error(e) {
  this.active = false
  this.sink.error(this.scheduler.now(), e)
}

function end(x) {
  if (!this.active) {
    return
  }
  try {
    this.sink.end(this.scheduler.now(), x)
  } catch (e) {
    this.sink.error(this.scheduler.now(), x)
  }
}

function Subscription() {
  this.run = run.bind(this)
  this.dispose = dispose.bind(this)
  this.add = add.bind(this)
  this.error = error.bind(this)
  this.end = end.bind(this)
}

function create() {
  const sink = new Subscription()
  const stream = new Stream(new MulticastSource(sink))
  stream.drain()
  return {sink, stream}
}

export default create
