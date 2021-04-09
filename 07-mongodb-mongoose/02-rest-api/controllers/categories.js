const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  console.log(`categoryList start`);

  const categories = await Category.find({});

  ctx.body = {categories};
};
