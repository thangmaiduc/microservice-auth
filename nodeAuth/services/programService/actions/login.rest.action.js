const _ = require("lodash");
const crypto = require("crypto-js");

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
    var bytes = crypto.AES.decrypt(user.password, process.env.JWT_SECRETKEY);
    var passwordDecrypt = bytes.toString(crypto.enc.Utf8);
    console.log(passwordDecrypt);
    if (password !== passwordDecrypt) {
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "3 days",
    });
    let date = new Date();
    date.setDate(date.getDate()+3);
    const tokenObj = {
      token,
      userId : user.id,
      expiredAt: date
    }
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
