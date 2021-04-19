const User = require('../../models/User');


module.exports = async function authenticate(strategy, email, displayName, done) {
  
  console.log('email: ', email);

  try {
    if (!email) {
      return done(null, false, 'Не указан email');
    }
    
    const user = await User.findOne({ email });
    // console.log('user: ', user);
    
    if (!user) {
      const newUser = new User({ email, displayName: displayName || `Имя не указано`});
      await newUser.save();

      console.log(`Создали нового пользователя`);
      return done(null, newUser, 'Создали нового пользователя');
    }

    // console.log(`Найден пользователь ${email}: `, user);
    return done(null, user);

  } catch (err) {
    done(err);
  }

  done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
