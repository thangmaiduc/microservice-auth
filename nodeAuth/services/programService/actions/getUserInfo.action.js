const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const jwt = require("jsonwebtoken");
// const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
  try {
  //  const {token} = ctx.params.body;
  //   const decode =  jwt.verify(token, process.env.JWT_SECRETKEY);
  //   if(_.get(decode,'userId',null)==null){
  //       return{
  //           code: 403,
  //           msg: "token hết hạn hoặc không đúng"
  //       }
  //   }
  //   const user = await ctx.call('userModel.findOne', [{_id:decode.userId},{password:0},])
  console.log( ctx.meta);
    return {user : ctx.meta.auth.data};
    
  } catch (err) {
      console.log(err);
    return err.message
  }
};
