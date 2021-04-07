const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');


const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes(`/`) || pathname.includes(`..`)) {
    res.statusCode = 400;
    res.end(`Извините, вложенные папки не поддерживаются`);
    return;
  }


  switch (req.method) {
    case 'DELETE':
      if (!filepath) {
        console.log(`404 file not found`);
        res.statusCode = 404;
        res.end(`404 file not found`);
        return;
      }

      fs.unlink(filepath, err => {
        if (err) {
          // console.log(20);
          // console.log(`err: `, err.code, ` : `, err.message);

          if (err.code === `ENOENT`) {
            console.log(`404 file not found`);
            res.statusCode = 404;
            res.end(`404 file not found`);
            return;

            // const dirpath = path.join(__dirname, 'files');
            // console.log('dirpath: ', dirpath);

            // fs.stat(dirpath, (err, stats) => {
            //   console.log(30, ` - Нет директории.`);

            //   if (err) {
            //     console.log(40, ` - Создаём директорию...`);

            //     fs.mkdir(dirpath, {}, err => {
            //       if (err) {
            //         console.log(50, ` - Ошибка при создании директории - `, err.code);
            //         return;
            //       }
            //     })
            //   }
            // });
          }
        } else {
          // console.log(`Файл удалён`);
          res.statusCode = 200;
          res.end(`Файл удалён`);
        }
      })
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
