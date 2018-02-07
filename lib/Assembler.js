'use strict';

class Assembler {
  constructor (readables, options = { end: true }) {
    if (!readables) {
      throw new Error('Readables are missing.');
    }
    if (Array.isArray(readables)) {
      const privateCopy = readables.slice();

      readables = function () {
        return privateCopy.shift() || null;
      };
    }
    if (!(readables instanceof Function)) {
      throw new Error(`Argument error. Function expected, but got ${typeof readables}.`);
    }

    this.readables = readables;
    this.options = options;
  }

  async pipe (writeable) {
    if (!writeable) {
      throw new Error('Writeable stream is missing.');
    }

    let readStream;
    const waitForEndOrError = () => {
      return (resolve, reject) => {
        readStream.once('end', () => {
          resolve();
        });
        readStream.once('error', (err) => {
          readStream.unpipe();
          if (this.options.end) {
            writeable.end();
          }
          reject(err);
        });
      };
    };

    readStream = await this.readables();
    while (readStream !== null) {
      const end = new Promise(waitForEndOrError());

      readStream.pipe(writeable, { end: false });
      await end;
      readStream.unpipe(writeable);
      readStream = await this.readables();
    }
    writeable.end();

    return null;
  }
}

module.exports = Assembler;
