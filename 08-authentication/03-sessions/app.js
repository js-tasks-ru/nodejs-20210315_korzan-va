const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const { NotAuthorized } = require('./libs/errors');
const Session = require('./models/Session');
const { v4: uuid } = require('uuid');
const handleMongooseValidationError = require('./libs/validationErrors');
const mustBeAuthenticated = require('./libs/mustBeAuthenticated');
const {login} = require('./controllers/login');
const {oauth, oauthCallback} = require('./controllers/oauth');
const {me} = require('./controllers/me');

const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});


app.use((ctx, next) => {

  ctx.login = async function(user) {
    // console.log('user.email: ', user.email);
    ctx.user = user;

    const token = uuid();

    const session = new Session({
      token,
      lastVisit: new Date(),
      user: user._id
    });
    await session.save();

    return token;
  };

  return next();
});

const router = new Router({ prefix: '/api' });

router.use(async (ctx, next) => {
  const header = ctx.request.get('Authorization');
  if (!header) return next();

  // console.log(`Есть заголовок - authorization: `, header);
  if (header.includes(`Bearer`)) {
    const token = header.split(` `)[1];

    const session = await Session.findOne({ token }).populate(`user`);
    // console.log('session: ', session);

    if (session) {
      ctx.user = session.user;

      session.lastVisit = new Date();
      session.user = session.user._id;
      await session.save();

      // console.log('ctx.user: ', ctx.user);

    } else {
      ctx.body = `Неверный аутентификационный токен`;
      ctx.status = 401;
      throw new NotAuthorized(`Неверный аутентификационный токен`);
    }
  }
  
  return next();
});


router.post('/login', login);

router.get('/oauth/:provider', oauth);
router.post('/oauth_callback', handleMongooseValidationError, oauthCallback);

router.get('/me', mustBeAuthenticated, me);

app.use(router.routes());

// this for HTML5 history in browser
const fs = require('fs');

const index = fs.readFileSync(path.join(__dirname, 'public/index.html'));
app.use(async (ctx) => {
  if (ctx.url.startsWith('/api') || ctx.method !== 'GET') return;

  ctx.set('content-type', 'text/html');
  ctx.body = index;
});

module.exports = app;
