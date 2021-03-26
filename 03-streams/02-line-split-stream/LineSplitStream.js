const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.remainder = ``;
  }

  _transform(chunk, encoding, callback) {
    const str = this.remainder + chunk.toString();
    const lines = str.split(os.EOL);
    // console.log('lines: ', lines);

    const lastLine = lines.pop();
    // console.log('lines: ', lines);
    // console.log('lastLine: ', lastLine);

    for (let line of lines) {

      this.push(line);
    }

    if (str.endsWith(os.EOL)) {
      this.push(lastLine);

    } else {
      this.remainder = lastLine;
    }

    callback();
  }

  _flush(callback) {
    if (this.remainder) {
      this.push(this.remainder);
    }

    callback();
  }
}

module.exports = LineSplitStream;
