const url = require('url');
const http = require('http');
const path = require('path');
const { createReadStream } = require('fs');
// const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  console.log('req.url: ', req.url);
  console.log('req.method: ', req.method);

  const pathname = url.parse(req.url).pathname.slice(1);
  // const pathname = req.url.slice(1);
  console.log('pathname: ', pathname);

  // Проверка на вложенность
  const isDir = req.url.split(`/`).length > 2;
  if (isDir) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);
  console.log('filepath: ', filepath);

  const readStream = createReadStream(filepath, { highWaterMark: 2 ** 16 });

  switch (req.method) {
    
    case 'GET':
      console.log(`Start GET`);

      readStream.on(`error`, err => {
        console.log('err code: ', err.code);
        console.log('err message: ', err.message);

        switch (err.code) {
          case `ENOENT`:
            res.statusCode = 404;
            res.end();
            break;
          
          default:
            res.statusCode = 500;
            res.end();
        } 

      });

      let c = 1;
      readStream.on(`data`, chunk => {
        console.log('chunk №: ', c, ` length: `, chunk.length, ` bytes`);
        c++;
        res.write(chunk);
        
      });
      
      break;

    default:
      res.statusCode = 501;
      console.log('Not implemented');
      res.end('Not implemented');
  }

  readStream.once(`end`, () => {
    console.log(`Stream завершён.`);
    res.end();
  });
  readStream.once(`close`, () => {
    console.log(`Stream closed`);
  });
  
});

module.exports = server;
