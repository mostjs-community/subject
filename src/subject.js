import {Stream} from 'most'
import Subscription from './subscription'
import MulticastSource from 'most/lib/source/MulticastSource'

class Subject extends Stream {
  constructor(initial) {
    super()
    this.sink = new Subscription()
    this.source = new MulticastSource(this.sink)

    if (initial) {
      this.sink.add(initial)
    }
  }
}

export default (initial = null) => {
  const s = new Subject(initial)
  return {
    stream: s,
    sink: s.sink,
  }
}
