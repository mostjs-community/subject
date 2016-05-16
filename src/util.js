export function tryEvent (time, value, sink) {
  try {
    sink.event(time, value)
  } catch (err) {
    sink.error(time, err)
  }
}

export function tryEnd (time, value, sink) {
  try {
    sink.end(time, value)
  } catch (err) {
    sink.error(time, err)
  }
}
