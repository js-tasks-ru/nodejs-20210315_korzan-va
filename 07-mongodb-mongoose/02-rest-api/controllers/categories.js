const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  console.log(`START categoryList start`);

  const categories = await Category.find();
  ctx.body = {categories: categories.map(mapCategory)};
};
