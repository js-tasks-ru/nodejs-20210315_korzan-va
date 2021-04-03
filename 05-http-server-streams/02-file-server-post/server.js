const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');


const server = new http.Server();

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const dir = path.join(__dirname, `files`);
  console.log('Нужный каталог: ', dir);
  
  const filepath = path.join(__dirname, 'files', pathname);
  console.log('filepath: ', filepath);

  // Проверяем и исправляем требования по каталогу и файлу
  console.log(`10`);
  // fs.stat(dir, err => {
  //   if (err) {
  //     console.log("Каталог не найден, создаём...");

  //     fs.mkdir(dir, err => {
  //       if (err) throw err
  //       console.log(`Каталог создан`);
  //     });
  //   }
  // });
  

  // console.log(`1 - 2`);
  // fs.stat(filepath, (err, stats) => {
  //   console.log(`1 - 2 - 1`);
  //   if (err) throw err;

  //   if (stats.isFile()) {
  //     console.log(`1 - 2 - 2`);
  //     console.log(`Такой файл уже существует 2`);
  //     res.statusCode = 409;
  //     res.end(`Такой файл уже существует`);
  //     return;
  //   }
  // });


  // req.on('data', async (chunk) => {
  //   body = chunk;
  //   console.log('chunk: ', chunk);
  //   // body = Buffer.from(chunk).toString();
  //   // console.log('body toString: ', body);
  // })
  
  const body = [];
  for await (const chunk of req) {
    body.push(chunk)
  }
  // console.log(`20 body: `, ...body);

  // const stringBody = Buffer.concat(body).toString();
  // console.log(`stringBody1: `, stringBody);
  
  switch (req.method) {
    case 'POST':
      const readStream = fs.createReadStream()
      // flags чтобы гарантировать что в файл будет записываться
      // 
      // r+ - для обновления некоторых данных если options start указать индекс строки
      // w - для перезаписи файла
      const writeStream = () => fs.createWriteStream(filepath, { flags: `wx+` });
      let ws = writeStream();

      ws.on('error', err => {
        console.log(`50 ws.on('error')`);

        switch (err.code) {
          case `ENOENT`:
            fs.stat(dir, err => {
              if (err) {
                console.log("160 Каталог не найден, создаём");

                fs.mkdir(dir, (err) => {
                  if (err) throw err
                  console.log(`170 Каталог создан`);
                  ws = writeStream();
                  ws.write(...body);
                  console.log(`180 Файл создан`);
                  res.end(...body); 
                  return;
                });
              }
            });
            break;
          
          case `EEXIST`:
            console.log(`90 Такой файл уже существует EEXIST`);

            res.statusCode = 409;
            res.end(`Такой файл уже существует EEXIST`);
            return;
          
          default:
            console.log('100 Write stream error: ', err.code, err.message);
            return;

        }
      });
      
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
