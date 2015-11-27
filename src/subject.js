import {Stream} from 'most'
import MulticastSource from 'most/lib/source/MulticastSource'
import Subscription from './subscription'

function create() {
  const sink = new Subscription()
  const stream = new Stream(new MulticastSource(sink))
  stream.drain()
  return {sink, stream}
}

export default create
