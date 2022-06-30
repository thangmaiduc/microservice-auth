const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");
const { customAlphabet } = require("nanoid");
const { numbers } = require("nanoid-dictionary");
const nanoId = customAlphabet(numbers, 9);

module.exports = async function (ctx) {
  let unlock;
  try {
    // console.log("meta", ctx.meta);
    let { orderId } = ctx.params.input;
    let userId = ctx.meta.userId || ctx.params.body.userId;

    let order = await ctx.call("orderModel.findOne", [
      { orderId, state: orderContants.STATE.PENDING },
    ]);
    // console.log(order);
    if (_.get(order, "orderId", null) == null) {
      return {
        successed: false,
        message: "Đơn thanh toán không tồn tại hoặc đã thanh toán",
      };
    }
    let transaction = nanoId();
    let paymentObj = {
      transaction,
      orderId,
    };
    let payment = await ctx.call("paymentModel.create", [paymentObj]);
    let res = {};
    let data = {};
    if (_.get(order, "payMethod", null) === orderContants.PAYMETHOD.PAYME) {
      let wallet = await ctx.call("walletModel.findOne", [{ userId }]);

      if (_.get(wallet, "balance", 0) < order.amount) {
        await ctx.call("paymentModel.updateOne", [
          { transaction: payment.transaction },
          { state: orderContants.STATE.FAILED },
        ]);
        return {
          successed: false,
          message: "Số dư trong ví của bạn không đủ",
        };
      } else {
        unlock = this.broker.cacher.lock("Miniprogram.pay_userId:" + userId);
        // amount = intRad % 2 === 0 ? amount : -amount;
        let updatedWallet = await ctx.call("walletModel.findOneAndUpdate", [
          { userId },
          { $inc: { balance: -order.amount } },
          { new: true },
        ]);
        let historyTransactionObj = {
          amount: order.amount,
          action: false,
          userId,
          balance: updatedWallet.balance,
        };
        await ctx.call("HistoryTransactionModel.create", [
          historyTransactionObj,
        ]);
        await ctx.call("orderModel.updateOne", [
          { orderId: order.orderId },
          { state: orderContants.STATE.SUCCEEDED },
        ]);
        await ctx.call("paymentModel.updateOne", [
          { transaction: payment.transaction },
          { state: orderContants.STATE.SUCCEEDED },
        ]);
        res.message = "Thanh toán thành công";
        res.successed = true;
      }
    } else {
      res.message = "Vui lòng thanh toán tại link";
      res.successed = true;
      data.url = "https://atmcard.payment.vn";
    }
    data.transaction = payment.transaction;
    return {
      message: res.message,
      successed: res.successed,
      data,
    };
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.successed, null, null);
  } finally {
    if (_.isFunction(unlock)) await unlock();
  }
};
