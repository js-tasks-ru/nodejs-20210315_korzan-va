const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // `Поле с названием категории не должно быть пустым`,
  },
  description: {
    type: String,
    required: true, // `Поле с описанием товара не должно быть пустым`,
  },
  price: {
    type: Number,
    required: true, // `Поле с ценой товара не должно быть пустым`,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: `Category`,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: `Category`,
  },
  images: [String],
});

module.exports = connection.model('Product', productSchema);
