const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      try {
        const user = await User.findOne({email});
        if (!user) {
          return done(null, false, 'Нет такого пользователя');
        }

        if (user.verificationToken) {
          console.log('user.verificationToken: ', user.verificationToken);
          // ctx.status = 400;
          // ctx.body = { error: "подтвердите email" }
          return done(null, false, 'Подтвердите email');
        }

        const isValidPassword = await user.checkPassword(password);

        if (!isValidPassword) {
          return done(null, false, 'Невереный пароль');
        }

        return done(null, user);
      } catch (err) {
        done(err);
      }
    },
);
