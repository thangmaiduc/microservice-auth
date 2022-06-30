const _ = require("lodash");
const bcrypt= require("bcryptjs");

const { MoleculerError,MoleculerClientError } = require("moleculer").Errors;
const jwt = require("jsonwebtoken");
// const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
  try {
    const { email, password } = ctx.params.body;
    const user = await ctx.call("userModel.findOne", [{ email }]);
    if (_.isNil(user)) {
      throw new MoleculerError(
        "Email hoặc mật khẩu không hợp lệ",
        400,
        null,
        email
      );
    }
    const isMatch=password===user.password?true:false
    // let passwordHash= await bcrypt.hash(password,8)
    // console.log(passwordHash);
    if(!isMatch) {
      throw new MoleculerError(
        "Email hoặc mật khẩu không hợp lệ",
        400,
        null,
        email
      );
    }

    // console.log(user);
    if (_.isNil(user)) {
      throw new MoleculerError(
        "Email hoặc mật khẩu không hợp lệ",
        400,
        null,
        email
      );
    }
    const token = jwt.sign({ userId: user._id, userAgent:ctx.meta.userAgent }, process.env.JWT_SECRETKEY, {
      expiresIn: "3 days",
    });
    let date = new Date();
    date.setDate(date.getDate()+3);
    const tokenObj = {
      token,
      userId : user.id,
      userAgent: ctx.meta.userAgent,
      expiredAt: date
    }
    await ctx.call('tokenModel.deleteMany', [{ userId:ctx.meta.userId }]);
    await ctx.call('tokenModel.create', [tokenObj]);

    return {
      code: 200,
      user,
      token,
    };
  } catch (err) {
    throw new MoleculerError(
      err.message,
      err.code,
      null,
      err.data
    );
  }
};
