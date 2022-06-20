const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    console.log('params',ctx.params);
    const { partnerTransaction, amount, ipnUrl, description, payMethod } =
      ctx.params.input;
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
    console.log(objOrder);
    if (checkOrder) {
      return {
        successed: false,
        message: "Mã giao dịch của đối tác đã tồn tại",
        dataCreateOrderInfoResponse:{}
      };
    }
    let order = await ctx.call("orderModel.create", [objOrder]);
    // console.log(order);
    let res = {};
    let data = {};
    if (_.get(order, "payMethod", null) === orderContants.PAYMETHOD.PAYME) {
      let wallet = await ctx.call("walletModel.findOne", [{ userId }]);
      if (_.get(wallet, "balance", 0) < amount) {
        ctx.call("orderModel.findOneAndUpdate", [
          { transaction: order.transaction },
          { state: orderContants.STATE.FAILED },
        ]);
        return {
          successed: false,
          message: "Số dư trong ví của bạn không đủ",
          dataCreateOrderInfoResponse:{}
        };
      } else {
        await ctx.call("walletModel.updateOne", [
          { userId },
          { balance: wallet.balance - amount },
        ]);
        await ctx.call("orderModel.updateOne", [
          { transaction: order.transaction },
          { state: orderContants.STATE.SUCCEEDED },
        ]);
        res.message = "Thanh toán thành công";
        res.successed = true;
      }
    } else {
      res.message = "Tạo đơn hàng thanh cồng, vui lòng thanh toán tại link";
      res.successed = true;
      data.url = "https://atmcard.payment.vn";
      data.transaction = order.transaction;
    }
    dataCreateOrderInfoResponse = {
      url: data.url,
      transaction: data.transaction,
    };
    return {
      successed: res.successed,
      message: res.message,
      dataCreateOrderInfoResponse,
    };
  } catch (err) {
    console.log(err);
    return {
      successed: false,
      message: err.message,
      dataCreateOrderInfoResponse:{}
    };
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
