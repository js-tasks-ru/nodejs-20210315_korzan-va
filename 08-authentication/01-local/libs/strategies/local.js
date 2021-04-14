// const LocalStrategy = require('passport-local');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

class NotFoundUser extends Error {
  constructor() {
    super();
    this.status = 404;
    this.message = "Нет такого пользователя";
  }
}
class FalsePassword extends Error {
  constructor() {
    super();
    this.status = 403;
    this.message = "Неверный пароль";
  }
}

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false },
  
  async (email, password, done) => {
    console.log(`1 LocalStrategy start...`);

    const user = await User.findOne({ email }, {}).select('+password +salt');
    console.log(`2 LocalStrategy start...`);

    if (!user) {
      return done(null, false, "Нет такого пользователя");
    }
    if (!await user.checkPassword(password)) {
      return done(null, false, "Неверный пароль");
    }
    
    return done(null, user);
      
    // done(null, false, 'Стратегия подключена, но еще не настроена');
  },
);
