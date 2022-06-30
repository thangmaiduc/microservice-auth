const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    const { orderId } = ctx.params.body;
    let userId = ctx.meta.userId;
    console.log(ctx.params);
    let order = await ctx.call("orderModel.findOne", [{ orderId, userId }]);
    if (!order) {
      return {
        successed: false,
        message: "Thông tin đơn hàng không tồn tại",
      };
    }
    let user = await ctx.call("userModel.findOne", [{ id: userId }]);
    delete user.password;
    order.user = user
    return {
      successed: true,
      message: "Thành công",
      orderInfo: order,
    };
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
