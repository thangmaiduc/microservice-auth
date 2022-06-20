const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    const { transaction, amount, state } = ctx.params.input;
    console.log((transaction));
    // let objOrder = {
    //   transaction,
    //   amount,
    //   state,
    // };
    let checkOrder = await ctx.call("orderModel.findOneAndUpdate", [
      { transaction, state: orderContants.STATE.PENDING },
      { state },
    ]);
    if (!checkOrder) {
      return {
        successed: false,
        message: "Đơn thanh toán không tồn tại hoặc đã thanh toán",
      };
    }

    return {
      message: "Thành công",
      successed: true,
    };
  } catch (err) {
    console.log(err);
    return {
      successed: false,
      message: "Đơn thanh toán không tồn tại hoặc đã thanh toán",
    };
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
