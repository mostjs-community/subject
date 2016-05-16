/* eslint max-nested-callbacks: 0 */
/* global describe, it */
import assert from 'power-assert'
import {Stream} from 'most'
import {subject, holdSubject} from '../src'

describe('subject()', () => {
  describe('stream', () => {
    it('should be an extension of Stream', () => {
      const s = subject()
      assert.strictEqual(s instanceof Stream, true)
    })

    it('should inherit Stream combinators', done => {
      const stream = subject()

      stream
        .map(x => x * x)
        .forEach(x => {
          assert.strictEqual(x, 25)
        }).then(done)

      stream.next(5)
      stream.complete()
    })
  })

  describe('observer', () => {
    it('should have next for sending new values', () => {
      const stream = subject()
      assert.strictEqual(typeof stream.next, 'function')
    })

    it('should allow nexting events', done => {
      const stream = subject()

      assert.strictEqual(typeof stream.next, 'function')

      stream.forEach(x => {
        assert.strictEqual(x, 1)
      }).then(done)

      stream.next(1)
      stream.complete()
    })

    it('should allow sending errors', done => {
      const stream = subject()

      assert.strictEqual(typeof stream.error, 'function')
      stream
        .drain()
        .then(assert.fail)
        .catch(err => {
          assert.strictEqual(err.message, 'Error Message')
          done()
        })

      stream.next(1)
      stream.next(2)
      stream.error(new Error('Error Message'))
    })

    it('should have complete for ending stream', () => {
      const stream = subject()
      assert.strictEqual(typeof stream.complete, 'function')
    })

    it('should allow ending of stream', done => {
      const stream = subject()

      stream
        .forEach(assert.fail)
        .then(done)
        .catch(assert.fail)

      stream.complete()
    })

    it('should not allow events after end', done => {
      const stream = subject()

      stream
        .forEach(assert.fail)
        .then(done)
        .catch(assert.fail)

      stream.complete()
      stream.next(1)
    })
  })
})

describe('holdSubject', () => {
  it('should throw if given a bufferSize less than 0', () => {
    assert.throws(() => {
      holdSubject(-1)
    })
  })

  it('should replay the last value', done => {
    const stream = holdSubject()
    stream.next(1)
    stream.next(2)

    stream.forEach(x => {
      assert.strictEqual(x, 2)
    }).then(done)

    setTimeout(() => stream.complete(), 10)
  })

  it('should allow for adjusting bufferSize of stream', done => {
    const stream = holdSubject(3)

    stream.next(1)
    stream.next(2)
    stream.next(3)
    stream.next(4)

    stream
      .reduce((x, y) => x.concat(y), [])
      .then(x => {
        assert.deepEqual(x, [2, 3, 4])
        done()
      })

    stream.complete()
  })
})
