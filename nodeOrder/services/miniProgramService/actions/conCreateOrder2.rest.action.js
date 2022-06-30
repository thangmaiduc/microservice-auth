const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  // let unlock;
  try {
    // console.log("meta", ctx.meta);
    let { partnerTransaction, amount, ipnUrl, description, payMethod } =
      ctx.params.body;
    let userId =  ctx.params.body.userId;
    // let userId = Math.floor(Math.random() * 2);
    // unlock = await this.broker.cacher.tryLock(`updateWallet_userId_${userId}`);
    let intRad = Math.floor(Math.random() * 1000);

    partnerTransaction += intRad;
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
    let res = {};
    let data = {};
    if (_.get(order, "payMethod", null) === orderContants.PAYMETHOD.PAYME) {
      // setTimeout(async () => {
      // let userId = Math.floor(Math.random() * 2) + 1;
      let wallet = await ctx.call("walletModel.findOne", [{ userId }]);
      if (_.get(wallet, "balance", 0) < amount) {
        ctx.call("orderModel.updateOne", [
          { transaction: order.transaction },
          { state: orderContants.STATE.FAILED },
        ]);
        return {
          code: 1001,
          message: "Số dư trong ví của bạn không đủ",
        };
      } else {
        amount = intRad % 2 === 0 ? amount : -amount;

        let updatedWallet = await ctx.call("miniProgram.rest.updateWallet", {
          amount,
          balance: wallet.balance,
          userId,
        });

        // let updatedWallet = await ctx.call("walletModel.findOneAndUpdate", [
        //   { userId },
        //   { balance: wallet.balance - amount },
        // ]);
        console.log(updatedWallet);
        let historyTransactionObj = {
          amount,
          action: false,
          userId,
          balance: updatedWallet.balance,
        };

        await ctx.call("HistoryTransactionModel.create", [
          historyTransactionObj,
        ]);
        await ctx.call("orderModel.updateOne", [
          { transaction: order.transaction },
          { state: orderContants.STATE.SUCCEEDED },
        ]);
        res.message = "Thanh toán thành công";
        res.code = 1000;
      }
      // }, 3000);
    } else {
      res.message = "Tạo đơn hàng thanh cồng, vui lòng thanh toán tại link";
      res.code = 1000;
      data.url = "https://atmcard.payment.vn";
      data.transaction = order.transaction;
    }
    // await unlock();
    return {
      message: res.message,
      code: res.code,
      data,
    };
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  } finally {
    // await unlock();
  }
};
