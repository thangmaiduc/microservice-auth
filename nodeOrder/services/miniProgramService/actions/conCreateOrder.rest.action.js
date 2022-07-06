const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");
const { customAlphabet } = require("nanoid");
const { numbers } = require("nanoid-dictionary");
const nanoId = customAlphabet(numbers, 9);

module.exports = async function (ctx) {
  // let unlock;
  try {
    // console.log("meta", ctx.meta);
    let { partnerTransaction, amount, ipnUrl, description, payMethod } =
      ctx.params.body;
    let userId =
      _.get(ctx, "meta.userId", null) != null
        ? ctx.meta.userId
        : ctx.params.body.userId;
    console.log(userId);

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
        code: 1001,
        message: "Mã giao dịch của đối tác đã tồn tại",
      };
    }
    let order = await ctx.call("orderModel.create", [objOrder]);
    let res = {};
    let data = {};

    res.message = "Tạo đơn hàng thanh cồng, vui lòng thanh toán tại link";
    res.code = 1000;
    data.url = "https://localhost:3000/pay";

    data.orderId = order.orderId;
    return {
      message: res.message,
      code: res.code,
      data,
    };
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
