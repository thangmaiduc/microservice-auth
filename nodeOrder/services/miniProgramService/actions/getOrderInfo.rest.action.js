const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    const { orderId } = ctx.params.body;
    let userId = ctx.meta.userId;
    let order = await ctx.call("orderModel.findOne", [
      { orderId,userId  },
    ]);
    if(!order){
      return{
        code: 1001,
        message: "Thông tin đơn hàng không tồn tại",
      }
    }
    return {
      code: 1000,
      data:order,
    };
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
