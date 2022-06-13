const _ = require("lodash");
const crypto = require("crypto-js");

const { MoleculerError, MoleculerClientError } = require("moleculer").Errors;
const jwt = require("jsonwebtoken");
// const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
  try {
    const { token } = ctx.params.body;
   
    
    const tokenObj = await ctx.call('tokenModel.findOne', [{token, userId:decode.userId }]);
    await ctx.call('tokenModel.delete', [{token, userId:decode.userId }]);
    return{
        code:200,
        msg: 'Thành công'
    }
  } catch (err) {
    throw new MoleculerClientError(err.message, err.code, null, err.data);
  }
};
