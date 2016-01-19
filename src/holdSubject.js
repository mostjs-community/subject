import subject from './subject'
import hold from '@most/hold'

export default function holdSubject() {
  const {sink, stream} = subject()
  const holdStream = hold(stream)
  return {sink, stream: holdStream}
}
