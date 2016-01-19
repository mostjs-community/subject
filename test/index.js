import assert from 'assert'
import {Stream} from 'most'
import hold from '@most/hold'
import * as Subjects from '../src'

Object.keys(Subjects)
  .forEach(subject => {
    describe(`${subject}`, () => {
      it('should return Object with stream and sink', done => {
        const s = Subjects[subject]()
        assert.strictEqual(typeof s, 'object')
        assert.strictEqual(typeof s.stream, 'object')
        assert.strictEqual(typeof s.sink, 'object')
        done()
      })

      describe('stream', () => {
        it('should be an extension of Stream', done => {
          const {stream} = Subjects[subject]()
          assert.strictEqual(stream instanceof Stream, true)
          done()
        })

        it('should be hold-able', done => {
          const {sink, stream} = Subjects[subject]()
          const hstream = hold(stream)

          hstream
            .forEach(x => {
              assert.strictEqual(x, 1)
            })

          setTimeout(() => {
            hstream.forEach(x => {
              assert.strictEqual(x, 1)
              done()
            })
          }, 10)

          sink.add(1)
        })

        it('should inherit Stream combinators', done => {
          const {sink, stream} = Subjects[subject]()

          stream
            .map(x => x * x)
            .forEach(x => {
              assert.strictEqual(x, 25)
              done()
            })

          sink.add(5)
          sink.end()
        })
      })

      describe('sink', () => {
        it('should allow nexting events', done => {
          const {sink, stream} = Subjects[subject]()

          assert.strictEqual(typeof sink.add, 'function')

          stream.forEach(x => {
            assert.strictEqual(x, 1)
            done()
          })

          sink.add(1)
          sink.end()
        })

        it('should allow sending errors' , done => {
          const {sink, stream} = Subjects[subject]()

          assert.strictEqual(typeof sink.error, 'function')
          stream
            .drain()
            .then(assert.fail)
            .catch(err => {
              assert.strictEqual(err.message, 'Error Message')
              done()
            })

          sink.add(1)
          sink.add(2)
          sink.error(new Error('Error Message'))
        })

        it('should allow ending of stream', done => {
          const {sink, stream} = Subjects[subject]()

          stream
            .forEach(assert.fail)
            .then(done)
            .catch(assert.fail)

          sink.end()
        })

        it('should not allow events after end', done => {
          const {sink, stream} = Subjects[subject]()

          const now = () => setTimeout(done, 10)
          stream
            .forEach(assert.fail)
            .then(now)
            .catch(assert.fail)

          sink.end()
          sink.add(1)
        })

        it('sink should have es7 observer methods', done => {
          const {sink, stream} = Subjects[subject]()

          assert.strictEqual(typeof sink.add, 'function')

          stream.forEach(x => {
            assert.strictEqual(x, 1)
          }).then(done)

          sink.next(1)
          sink.complete()
        })
      })

      if (subject === 'subject') {
        it('should be `hot` by default', done => {
          const {sink, stream} = Subjects[subject]()

          sink.add(2)
          sink.add(3)

          stream
            .observe(x => {
              assert.strictEqual(x, 1)
            })
            .then(done)
            .catch(assert.fail)

          sink.add(1)
          sink.end()
        })
      }

      if(subject === 'holdSubject') {
        describe('holdSubject', () => {
          it('should be held by default', done => {
            const {sink, stream} = Subjects[subject]()

            stream
              .forEach(x => {
                assert.strictEqual(x, 1)
              })

            setTimeout(() => {
              stream.forEach(x => {
                assert.strictEqual(x, 1)
                done()
              })
            }, 10)

            sink.add(1)
          })
        })
      }

      if (subject === 'behaviorSubject') {
        describe('behaviorSubject', () => {
          it('should allow for a default value', done => {
            const {sink, stream} = Subjects[subject](123)

            stream.forEach(x => {
              assert.strictEqual(x, 123)
            }).then(done)

            sink.end()
          })

          it('should allow finding latest value from `.value`', done => {
            const {sink, stream} = Subjects[subject](123)

            stream.forEach(x => {
              assert.strictEqual(x, sink.value)
            }).then(done)

            sink.add(1)
            sink.add(2)
            sink.end()
          })
        })
      }
    })
  })
