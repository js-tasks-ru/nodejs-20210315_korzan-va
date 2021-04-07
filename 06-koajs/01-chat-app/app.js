const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

// app.use(async (ctx, next) => {
//   ctx.set('Access-Control-Allow-Origin', '*');
//   ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
//   ctx.body = 'hello';
// });

// ctx.assert(book, 404);
// ctx.assert.equal('object', typeof ctx.body, 500, 'some dev did something wrong')

let subscribers = new Set();


router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve, reject) => {
    subscribers.add(resolve);

    ctx.res.on('close', function() {
      subscribers.delete(resolve);
      resolve();
    });
  });

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const { message } = ctx.request.body;
  if (!message?.trim()) {
    ctx.throw(400, 'required field `message` is missing');
  }

  subscribers.forEach(func => {
    // console.log('func: ', func);
    func(message);
    // ctx = item;
    // ctx.response.status = 200;
    // console.log(`message: `, message);
    // ctx.response.body = message;
  })


    // ctx.response.status = 200;
    // console.log(`message: `, message);
    // ctx.response.body = message;
    // ctx.res.statusCode = 200;
    // ctx.res.end(message);

  subscribers.clear();

  console.log(`/publish body: `, message);
  ctx.body = 'ok';
});

app.use(router.routes());

app.on(`close`, () => {
  console.log(`close`);
});

app.on('error', err => {
  console.log('Server error', err)
});

module.exports = app;
