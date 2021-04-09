const Product = require('../models/Product');
const mongoose = require('mongoose');


module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  console.log(`productsBySubcategory start`);
  // console.log(`ctx: `, ctx);
  const url = ctx.request.url;
  const urlPathIdx = url.indexOf(`?`);

  if (!urlPathIdx) {
    console.log(`Нет ?`);
    return
  }
  const urlPairs = url.slice(urlPathIdx + 1).split(`&`);
  console.log('urlPairs: ', urlPairs);

  const subcategoryPair = urlPairs.find(it => it.includes(`subcategory`))
  if (!subcategoryPair) {
    console.log(`Нет subcategory`);
    // const productWithoutSubCategory = await Product.find({});

    next();
    // return productWithoutSubCategory;
  }
  // console.log('subcategoryPair: ', subcategoryPair);
  const subcategory = subcategoryPair.split(`=`)[1];
  console.log('subcategory: ', subcategory);

  let products = await Product.find({ subcategory });
  console.log('productBySubCategory: ', products);
  if (!products) products = [];

  ctx.body = { products };
  // next();
};

module.exports.productList = async function productList(ctx, next) {
  console.log(`productList start`);
  console.log(`params: `, ctx.params);
  console.log(`ctx.request.body: `, ctx.request.body);
  let products = await Product.find({});
  if (!products) products = [];
  ctx.body = { products};
};

module.exports.productById = async function productById(ctx, next) {
  console.log(`productById start`);
  console.log(`params: `, ctx.params);
  const id = ctx.params.id;

  if (typeof id !== mongoose.Types.ObjectId) {
    console.log(`Не валидный id...`);
    ctx.body = `Не валидный id...`;
    ctx.status = 400
  }
  const products = await Product.find({id})
  ctx.body = {};
};

