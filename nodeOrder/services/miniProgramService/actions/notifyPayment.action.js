const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    const { transaction, amount, state } = ctx.params.body;
    console.log(typeof(transaction));
    // let objOrder = {
    //   transaction,
    //   amount,
    //   state,
    // };
    let checkOrder = await ctx.call("orderModel.findOneAndUpdate", [
      { transaction },
      { state },
    ]);
    if (!checkOrder) {
      return {
        code: 1001,
        message: "Đơn thanh toán không tồn tại",
      };
    }

    return {
      message: "Thành công",
      code: 1000,
    };
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
