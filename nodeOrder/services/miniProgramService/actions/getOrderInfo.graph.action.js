const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    const { transaction } = ctx.params.input;
    let userId = ctx.meta.userId;
    console.log(ctx.params);
    let order = await ctx.call("orderModel.findOne", [
      { transaction,userId  },
    ]);
    if(!order){
      return{
        successed: false,
        message: "Thông tin đơn hàng không tồn tại",
      }
    }
    return {
      successed: true,
      message: "Thành công",
      orderInfo:order,
    };
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
