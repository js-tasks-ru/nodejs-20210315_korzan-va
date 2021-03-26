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
    this.totalSize += chunk.length;
    // console.log('totalSize: ', this.totalSize);

    if (this.totalSize > this.#limit) error = new LimitExceededError();

    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
