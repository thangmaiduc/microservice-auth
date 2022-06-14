const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    const { partnerTransaction, amount, ipnUrl, description, payMethod } =
      ctx.params.body;
    let userId = ctx.meta.userId;
    let objOrder = {
      partnerTransaction,
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
    console.log(order);
    let res = {};
    let data = {};
    if (_.get(order, "payMethod", null) === orderContants.PAYMETHOD.PAYME) {
      let wallet = await ctx.call("walletModel.findOne", [{ userId }]);
      if (wallet.balance < amount) {
        ctx.call("orderModel.findOneAndUpdate", [
          { transaction: order.transaction },
          { state: orderContants.STATE.CANCELED },
        ]);
        return {
          code: 1001,
          message: "Số dư trong ví của bạn không đủ",
        };
      } else {
        await ctx.call("walletModel.findOneAndUpdate", [
          { userId },
          { balance: wallet.balance - amount },
        ]);
        ctx.call("orderModel.findOneAndUpdate", [
          { transaction: order.transaction },
          { state: orderContants.STATE.SUCCEEDED },
        ]);
        res.message = "Thanh toán thành công";
        res.code = 1000;
      }
    } else {
      res.message = "Tạo đơn hàng thanh cồng, vui lòng thanh toán tại link";
      res.code = 1000;
      data.url = "https://google.com.vn";
      data.transaction = order.transaction;
    }
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
