var Benchmark = require('benchmark')
var most = require('../dist/most-subject')
var xs = require('xstream').default
var rxjs = require('rxjs')

var runners = require('./runners')

// Create a stream from an Array of n integers
// filter out odds, map remaining evens by adding 1, then reduce by summing
var n = runners.getIntArg(1000000)
var a = new Array(n)
for (var i = 0; i < a.length; ++i) {
  a[i] = i
}

var suite = Benchmark.Suite('filter -> map -> reduce ' + n + ' integers')
var options = {
  defer: true,
  onError: function (e) {
    e.currentTarget.failure = e.error
  }
}

suite
  .add('most', function (deferred) {
    var subject = most.subject()
    runners.runMost(deferred, subject.filter(even).map(add1).reduce(sum, 0))
    for (var i = 0; i < a.length; ++i) {
      subject.next(a[i])
    }
    subject.complete()
  }, options)
  .add('xstream', function (deferred) {
    var subject = xs.create()
    runners.runXStream(deferred, subject.filter(even).map(add1).fold(sum, 0).last())
    for (var i = 0; i < a.length; ++i) {
      subject.shamefullySendNext(a[i])
    }
    subject.shamefullySendComplete()
  }, options)
  .add('rx 5', function (deferred) {
    var subject = new rxjs.Subject()
    runners.runRx5(deferred, subject.filter(even).map(add1).reduce(sum, 0))
    for (var i = 0; i < a.length; ++i) {
      subject.next(a[i])
    }
    subject.complete()
  }, options)

runners.runSuite(suite)

function add1 (x) {
  return x + 1
}

function even (x) {
  return x % 2 === 0
}

function sum (x, y) {
  return x + y
}
