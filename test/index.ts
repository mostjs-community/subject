import * as assert from 'assert';
import { subject, holdSubject } from '../src/index';

describe('Async - subject', () => {
  it('should be asynchronous by default', () => {
    const stream = subject<number>();

    stream.next(1);
    stream.complete();

    return stream.observe((x: number) => {
      assert(x === 1);
    });
  });

  it('should not notify existing observers after end', done => {
      const stream = subject();

      stream
        .forEach(assert.fail)
        .then(() => {
          setTimeout(done);
        })
        .catch(assert.fail);

      stream.complete();
      setTimeout(() => stream.next(1));
    });
});

describe('Async - holdSubject', () => {
  it('should be asynchronous by default', () => {
    const stream = holdSubject<number>();

    stream.next(1);
    stream.next(2);
    stream.complete();

    const expected = [1, 2];

    return stream.observe((x: number) => {
      assert(x === expected.shift());
    });
  });
});
