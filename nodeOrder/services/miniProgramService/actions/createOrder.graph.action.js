const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    let { partnerTransaction, amount, ipnUrl, description, payMethod } =
      ctx.params.input;
    let userId;
    if (_.get(ctx, "meta.userId", null) !== null)
      userId = ctx.meta.userId || ctx.params.body.userId;
    let intRad = Math.floor(Math.random() * 1000);
    // unlock = this.broker.cacher.lock("createOrder_userId:" + userId);
    partnerTransaction += intRad;
    // transaction = nanoId();
    let objOrder = {
      partnerTransaction,
      // transaction,
      amount,
      ipnUrl,
      description,
      userId,
      payMethod,
    };
    let checkOrder = await ctx.call("orderModel.findOne", [
      { partnerTransaction },
    ]);
    if (checkOrder) {
      return {
        successed: false,
        message: "Mã giao dịch của đối tác đã tồn tại",
        dataCreateOrderInfoResponse: {},
      };
    }
    let order = await ctx.call("orderModel.create", [objOrder]);
    let res = {};
    res.message = "Tạo đơn hàng thanh cồng, vui lòng thanh toán tại link";
    let dataCreateOrderInfoResponse = {};
    dataCreateOrderInfoResponse.url = "https://localhost:3000/pay";

    dataCreateOrderInfoResponse.orderId = order.orderId;
    return {
      successed: true,
      message: res.message,
      dataCreateOrderInfoResponse,
    };
  } catch (err) {
    console.log(err);
    return {
      successed: false,
      message: err.message,
      dataCreateOrderInfoResponse: {},
    };
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
