const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('../config');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

mongoose.set('debug', false);

mongoose.plugin(beautifyUnique);
module.exports = mongoose.createConnection(config.mongodb.uri);