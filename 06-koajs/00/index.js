const http = require('http');
const url = require('url');
const querystring = require('querystring');
const static = require('node-static');

const fileServer = new static.Server(`.`);

let subscribers = Object.create(null);

function onSubscribe(req, res) {
  const id = Math.random();

  res.setHeader(`Content-type`, `text/plain;charset=utf-8`);
  res.setHeader(`Cache-Control`, `no-cache, must-revalidate`);

  subscribers[id] = res;

  req.on(`close`, () => delete subscribers[id]);
}

function publish(message) {
  for (let id in subscribers) {
    let res = subscribers[id];
    res.end(message);
  }
  subscribers = Object.create(null);
}

function accept(req, res) {
  const urlParsed = url.parse(req.url, true);

  // новый клиент хочет получать сообщения
  if (urlParsed.pathname === `/subscribe`) {
    onSubscribe(req, res);
    return;
  }

  // отправка сообщения (публикация)
  if (urlParsed.pathname === `/publish` && req.method === `POST`) {
    req.setEncoding(`utf-8`);

    let message = '';
    req
      .on(`data`, (chunk) => {
        message += chunk;
      })
      .on(`end`, () => {
        publish(message); // Опубликовать для всех
        res.end(`Ok`);
      });
    
    return;
  }

  // остальное - статика
  fileServer.serve(req, res);
}

function close(req, res) {
  for (let id in subscribers) {
    let res = subscribers[id];
    res.end();
  }
}

// -----------------------------------

if (!module.parent) {
  http.createServer(accept).listen(8000);
  console.log('Server running on port 8080');
} else {
  exports.accept = accept;

  if (process.send) {
    process.on(`message`, msg => {
      if (msg === `shutdown`) {
        close();
      }
    })
  }

  proccess.on(`SIGINT`, close);
}