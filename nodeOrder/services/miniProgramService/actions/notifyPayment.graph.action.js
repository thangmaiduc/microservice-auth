const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    const { supplierTransaction, transaction, amount, state } =
      ctx.params.input;
    let response = ctx.params.input;
    // console.log(transaction);
    // let objOrder = {
    //   transaction,
    //   amount,
    //   state,
    // };

    let payment = await ctx.call("paymentModel.findOneAndUpdate", [
      { transaction, state: orderContants.STATE.PENDING },
      { state },
    ]);

    if (!payment) {
      return {
        successed: false,
        message: "Mã giao dịch không tồn tại",
      };
    }
    let checkSupplierRes = await ctx.call("supplierResponseModel.findOne", [
      { supplierTransaction },
    ]);
    if (checkSupplierRes) {
      return {
        successed: false,
        message: "Mã giao dịch đối tác đã tồn tại",
      };
    }
    let order = await ctx.call("orderModel.findOneAndUpdate", [
      { orderId: payment.orderId, state: orderContants.STATE.PENDING },
      { state },
    ]);
    if (!order) {
      await ctx.call("paymentModel.updateOne", [
        { transaction },
        { state: orderContants.STATE.FAILED },
      ]);
      return {
        successed: false,
        message: "Đơn hàng không tồn tại",
      };
    }

    await ctx.call("supplierResponseModel.create", [
      { supplierTransaction, response, transaction, amount, state, response },
    ]);
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
