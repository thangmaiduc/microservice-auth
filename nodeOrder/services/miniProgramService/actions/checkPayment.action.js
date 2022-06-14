const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    let orders = await ctx.call("orderModel.findMany", [
      { state: orderContants.STATE.PENDING },
    ]);
    console.log("Checking payment.....");
    let flag = 0;
    await Promise.all(
      orders.map(async (order) => {
        let twoHours = 1000 * 60 * 120;
        if (new Date().getTime() - order.createdAt.getTime() > twoHours) {
          await ctx.call("orderModel.findOneAndUpdate", [
            { transaction: order.transaction },
            { state: orderContants.STATE.EXPIRED },
          ]);
          flag++
        }
      })
    );
    console.log("Check payment finished: ", flag);
    return flag;
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
