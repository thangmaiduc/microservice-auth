const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const jwt = require("jsonwebtoken");
const userModel = require('../model/tokenModel')
// const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
  try {
   const {rmvToken, user} = ctx.params;
   user.tokens= user.tokens.filter (token => rmvToken !==token);
   await user.save();
  } catch (err) {
      
  }
};
