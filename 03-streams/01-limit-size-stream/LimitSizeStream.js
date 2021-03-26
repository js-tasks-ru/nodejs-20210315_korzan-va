const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #limit = 0;

  constructor(options) {
    super(options);
    this.#limit = options.limit;
    this.totalSize = 0;
  }

  _transform(chunk, encoding, callback) {
    let error;
    try {
      this.totalSize += chunk.length;
      // console.log('totalSize: ', this.totalSize);

      if (this.totalSize > this.#limit) throw new LimitExceededError();

    } catch (e) {
      error = e;
    }

    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
