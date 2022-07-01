const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const jwt = require("jsonwebtoken");
// const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
  try {
    return { user: ctx.meta.auth.data };
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
