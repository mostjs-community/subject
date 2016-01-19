import {Stream} from 'most'
import MulticastSource from 'most/lib/source/MulticastSource'
import hold from '@most/hold'

import {Subscription} from './subject'

class BehaviorSubscription extends Subscription {
  constructor(intialValue) {
    super()

    this.run = (sink, scheduler) => this._run(sink, scheduler)
    this.add = x => this._add(x)
    this.error = err => this._error(err)
    this.end = x => this._end(x)
    this.value = void 0

    if (typeof initialValue !== 'undefined') {
      this.value = initialValue
      this.add(x)
    }
  }

  _add(x) {
    this.value = x
    super._add(x)
  }
}

function create(initialValue) {
  const sink = new BehaviorSubscription(initialValue)
  const stream = new Stream(new MulticastSource(sink))
  const holdStream = hold(stream)
  holdStream.observe(x => {
    stream.value = x
  })
  return {sink, stream: holdStream}
}

export default create
