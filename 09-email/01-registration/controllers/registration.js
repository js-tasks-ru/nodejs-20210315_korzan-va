const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const { email, password, displayName } = ctx.request.body;
  const verificationToken = uuid();

  const user = new User({ email, password, displayName, verificationToken });  

  await user.setPassword(password);
  await user.save();

  await sendMail({
    template: 'confirmation',
    locals: {token: verificationToken},
    to: email,
    subject: 'Подтвердите почту',
  });

  ctx.body = {status: "ok"}
  ctx.status = 201;
  
};

module.exports.confirm = async (ctx, next) => {
  // const arr = ctx.request.header?.referer?.split(`/`);
  // if (!arr?.length) {
  //   console.log(`verificationToken null`);
  //   ctx.body = { "error": "Ссылка подтверждения недействительна или устарела" };
  //   ctx.status = 400;
  //   return;
  // }

  // const verificationToken = arr[arr.length - 1];

  const verificationToken = ctx.request.body.verificationToken;

  // const user = await User.findOneAndDelete({ email: `korzan.va@mail.ru` });
  const user = await User.findOne({ verificationToken });

  if (user) {
    user.verificationToken = undefined;
    await user.save();

    const token = uuid();

    ctx.body = { token };
    // ctx.status = 200;

  } else {
    ctx.throw(400, "Ссылка подтверждения недействительна или устарела");
  }

};
