const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // `Поле с названием подкатегории не должно быть пустым`,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // `Поле с названием категории не должно быть пустым`,
  },
  subcategories: [subCategorySchema],
});

module.exports = connection.model('Category', categorySchema);
