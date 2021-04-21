const { NotAuthorized } = require('../libs/errors');


module.exports = function mustBeAuthenticated(ctx, next) {

  if (!ctx.user) {
    throw new NotAuthorized(`Пользователь не залогинен`);
  }

  return next();
};
