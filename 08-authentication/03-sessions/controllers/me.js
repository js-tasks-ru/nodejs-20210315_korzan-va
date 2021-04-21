module.exports.me = async function me(ctx, next) {
  console.log('ctx.user: ', ctx.user);
  
  ctx.body = {
    email: ctx.user.email,
    displayName: ctx.user.displayName,
  };
};
