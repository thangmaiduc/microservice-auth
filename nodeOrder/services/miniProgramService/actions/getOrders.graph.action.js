const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");

module.exports = async function (ctx) {
  try {
    let orders = await ctx.call("orderModel.findMany", []);
    return {
      message:'thành công',
      successed:true,
      orderInfo:orders,
    };
  } catch (err) {
    
    return{
      successed:false,
      message:'thất bại',
      orderInfo:[],
    }
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  }
};
