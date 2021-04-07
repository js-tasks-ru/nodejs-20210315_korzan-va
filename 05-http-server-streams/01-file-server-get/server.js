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
  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);
  console.log('filepath: ', filepath);

  const readStream = createReadStream(filepath);

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

      readStream.pipe(res);
      
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
