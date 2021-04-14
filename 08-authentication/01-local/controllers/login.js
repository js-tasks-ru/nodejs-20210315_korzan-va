const { v4: uuid } = require('uuid');
const passport = require('../libs/passport');

module.exports.login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    console.log(`login start...`);
    console.log('err: ', err);
    console.log('user: ', user);
    console.log('info: ', info);

    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = {error: info};
      return;
    }

    const token = uuid();

    ctx.body = {token};
  })(ctx, next);
};
