const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const { product, phone, address } = ctx.request.body;
  
  const order = new Order({ user: ctx.user._id, product, phone, address });
  await order.save();

  await sendMail({
    template: `order-confirmation`,
    locals: { id: order._id, product },
    to: ctx.user.email,
    subject: `Подтверждение заказа`
  });

  ctx.body = { order: order._id };
  ctx.status = 200;

};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({ user: ctx.user._id });

  ctx.body = { orders };
  ctx.status = 200;
};
