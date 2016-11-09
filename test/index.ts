import * as assert from 'assert';
import { Stream } from 'most';
import { sync, hold, async, next, error, complete } from '../src';

describe('sync()', () => {
  it('should be an extension of Stream', () => {
    const s = sync();
    assert.strictEqual(s instanceof Stream, true);
  });

  it('should inherit Stream combinators', done => {
    const stream = sync<number>();

    stream
      .map(x => x * x)
      .forEach(x => {
        assert.strictEqual(x, 25);
        done();
      })
      .catch(done);

    stream.next(5);
  });

  it('should allow nexting values', (done) => {
    const stream = sync<number>();

    assert.strictEqual(typeof stream.next, 'function');

    stream
      .forEach(x => {
        assert.strictEqual(x, 1);
        done();
      })
      .catch(done);

    stream.next(1);
  });

  it('should allow sending errors', (done) => {
    const stream = sync<number>();

    assert.strictEqual(typeof stream.error, 'function');

    stream.drain().then(done)
      .catch((err: Error) => {
        assert.strictEqual(err.message, 'Error Message');
        done();
      });

    stream.next(1);
    stream.next(2);
    stream.error(new Error('Error Message'));
  });

  it('should allow ending of stream', (done) => {
    const stream = sync<any>();

    stream.drain().then(done).catch(done);

    stream.complete();
  });

  it('should not notify existing observer after end', (done) => {
    const stream = sync<number>();

    stream.observe(done).then(done).catch(done);

    stream.complete();
    stream.next(1);
  });

  it('should not notify existing observer after error', (done) => {
    const stream = sync<number>();

    stream.observe(done).catch(() => done());

    stream.error(new Error('error'));
    stream.next(1);
  });

  it('should allow new observers after end', (done) => {
    const stream = sync<number>();

    stream.complete();

    setTimeout(() => {
      stream.reduce((x, y) => x.concat([y]), [] as number[])
        .then((x: number[]) => {
          assert.deepEqual(x, [1, 2, 3]);
          done();
        })
        .catch(done);

      stream.next(1);
      stream.next(2);
      stream.next(3);
      stream.complete();
    });
  });

  it('should allow new observers after error', (done) => {
    const stream = sync<number>();

    stream.error(new Error());

    setTimeout(() => {
      stream.reduce((x, y) => x.concat([y]), [] as number[])
        .then((x: number[]) => {
          assert.deepEqual(x, [1, 2, 3]);
          done();
        })
        .catch(done);

      stream.next(1);
      stream.next(2);
      stream.next(3);
      stream.complete();
    });
  });

  it('should support transient use as a signal stream', (done) => {
    const stream = sync();
    const signalStream = sync();

    const observeUntilSignal = () => stream.until(signalStream).drain();

    observeUntilSignal()
      .then(() => {
        const promiseToEnd = observeUntilSignal();
        signalStream.next({});
        return promiseToEnd;
      })
      .then(() => done())
      .catch(done);

    signalStream.next({});
  });
});


describe('hold', () => {
  it('should buffer previous events', (done) => {
    const stream = hold(2, sync<number>());

    stream.next(1);
    stream.next(2);
    stream.next(3);

    const expected = [2, 3];

    stream.observe(x => {
      assert.strictEqual(x, expected.shift());
      if (expected.length === 0) {
        done();
      }
    })
    .catch(done);
  });
});

describe('async', () => {
  it('should produce values asynchonously', (done) => {
    const stream = async<number>();

    stream.next(1);
    stream.next(2);
    stream.next(3);

    const expected = [1, 2, 3];

    stream.observe(x => {
      assert.strictEqual(x, expected.shift());
      if (expected.length === 0) {
        done();
      }
    })
    .catch(done);
  });
});

describe('next', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof next, 'function');
  });

  it('should be curried', () => {
    const next1 = next(1);

    assert.strictEqual(typeof next1, 'function');
  });

  it('should be chainable', (done) => {
    const stream = next(3, next(2, next(1, async())));

    const expected = [1, 2, 3];

    stream.observe(x => {
      assert.strictEqual(x, expected.shift());
      if (expected.length === 0) {
        done();
      }
    })
      .catch(done);
  });
});

describe('error', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof error, 'function');
  });

  it('should be curried', () => {
    const error1 = error(new Error());

    assert.strictEqual(typeof error1, 'function');
  });

  it('should throw an error', (done) => {
    const err = new Error();
    const stream = error(err, async());

    stream.drain().catch(() => done());
  });
});

describe('complete', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof complete, 'function');
  });

  it('should be curried', () => {
    const complete1 = complete(1);

    assert.strictEqual(typeof complete1, 'function');
  });

  it('should end a stream', (done) => {
    const stream = complete(1, async());

    stream.drain()
      .then((x: number) => {
        assert.strictEqual(x, 1);
        done();
      })
      .catch(done);
  });
});
