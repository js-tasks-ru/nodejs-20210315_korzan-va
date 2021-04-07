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

let subscribers = [];


router.get('/subscribe', async (ctx, next) => {
  
  console.log(`/subscribe`);
  console.log('ctx: ', ctx);

  // await new Promise((resolve, reject) => {
  //   const run = (message) => {
  //     ctx.status = 200;
  //     ctx.body = message;
  //   };
  // });

  subscribers.push(new Promise((resolve, reject) => {
    console.log(`Promise RUN`);
    resolve((message) => {
      console.log('message in promise: ', message);
      
      ctx.status = 200;
      ctx.body = message;
      console.log('ctx: ', ctx);
      console.log('ctx.body: ', ctx.body);
    })
  }));

  // ctx.status = 200;
  // ctx.body = ctx.originalUrl;

  // ctx.on(`close`, () => delete subscribers[id]);
});

router.post('/publish', async (ctx, next) => {
  const { message } = ctx.request.body;
  if (!message?.trim()) {
    // console.log('!message?.trim(): ', !message?.trim());

    return next();
  }

  subscribers.forEach(item => {
    console.log('item: ', item);
    item.then(func => func(message));
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

  subscribers = [];

  console.log(`/publish body: `, message);
});

app.use(router.routes());

app.on(`close`, () => {
  console.log(`close`);
});

app.on('error', err => {
  console.log('Server error', err)
});

module.exports = app;
