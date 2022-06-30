const _ = require("lodash");
const awaitAsyncForeach = require("await-async-foreach");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../../miniProgramService/constants/orderContants");

module.exports = async function (ctx) {
  try {
    let orders = await ctx.call("orderModel.findMany", [
      { state: orderContants.STATE.PENDING },
      null,
      { limit: 20 },
    ]);
    console.log("Checking payment.....");
    let flag = 0;
    if (orders.length > 0)
      await awaitAsyncForeach(orders, async (order) => {
        console.log(order);
        let twoHours = 1000 * 60 * 120;
        if (new Date().getTime() - order.createdAt.getTime() > twoHours) {
          await ctx.call("orderModel.updateOne", [
            { orderId: order.orderId },
            { state: orderContants.STATE.EXPIRED },
          ]);
          flag++;
        }
      });

    console.log("Check payment finished: ", flag);
    return flag;
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
