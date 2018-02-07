'use strict';

const { PassThrough } = require('stream');

const assert = require('assertthat');

const Assembler = require('../lib/Assembler');

suite('Assembler', () => {
  test('is a function', async () => {
    assert.that(Assembler).is.ofType('function');
  });

  test('sets default for options', async () => {
    const assembler = new Assembler([]);

    assert.that(assembler.options.end).is.true();
  });

  test('sets end option to false', async () => {
    const assembler = new Assembler([], { end: false });

    assert.that(assembler.options.end).is.false();
  });

  test('sets end option to true', async () => {
    const assembler = new Assembler([], { end: true });

    assert.that(assembler.options.end).is.true();
  });

  test('throws error readables argument is missing', async () => {
    /* eslint-disable no-new */
    assert.that(() => {
      new Assembler();
    }).is.throwing('Readables are missing.');
    /* eslint-enable no-new */
  });

  test('throws error if wrong argument type is given', async () => {
    /* eslint-disable no-new */
    assert.that(() => {
      new Assembler({});
    }).is.throwing('Argument error. Function expected, but got object.');
    /* eslint-enable no-new */
  });

  test('creates readables function for array', async () => {
    const assembler = new Assembler([]);

    assert.that(assembler.readables).is.ofType('function');
  });

  test('readables function for array returns next element', async () => {
    const readables = [1, 2];
    const assembler = new Assembler(readables);

    assert.that(assembler.readables).is.ofType('function');
    assert.that(assembler.readables()).is.equalTo(1);
    assert.that(assembler.readables()).is.equalTo(2);
    assert.that(assembler.readables()).is.null();
  });

  test('throws error if writeable is missing', async () => {
    const assembler = new Assembler([]);

    await assert.that(async () => {
      await assembler.pipe();
    }).is.throwingAsync('Writeable stream is missing.');
  });

  test('pipes content to writeable stream', async () => {
    const readables = [new PassThrough(), new PassThrough()];
    const writeable = new PassThrough();
    const assembler = new Assembler(readables);

    setTimeout(() => {
      readables[1].end('hansi');
      readables[0].end('hugo&');
    }, 200);
    assert.that(await assembler.pipe(writeable)).is.equalTo(null);
    assert.that(writeable.read().toString()).is.equalTo('hugo&hansi');
  });

  test('throws error from readable stream', async () => {
    const readables = [new PassThrough()];
    const writeable = new PassThrough();
    const assembler = new Assembler(readables);

    setTimeout(() => {
      readables[0].emit('error', new Error('hugos error'));
    }, 150);
    await assert.that(async () => {
      await assembler.pipe(writeable);
    }).is.throwingAsync('hugos error');
  });

  test('throws error from writeable stream', async () => {
    const readables = [new PassThrough()];
    const writeable = new PassThrough();
    const assembler = new Assembler(readables);

    setTimeout(() => {
      writeable.emit('error', new Error('hansis error'));
    }, 150);
    await assert.that(async () => {
      await assembler.pipe(writeable);
    }).is.throwingAsync('hansis error');
  });
});
