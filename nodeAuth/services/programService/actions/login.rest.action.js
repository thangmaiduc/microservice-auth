const _ = require("lodash");
const crypto = require('crypto-js')

const { MoleculerError } = require("moleculer").Errors;
const jwt = require("jsonwebtoken");
// const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
  try {
    const { email, password } = ctx.params.body;
    const user = await ctx.call("userModel.findOne", [{ email }]);
    var bytes = crypto.AES.decrypt(user.password,process.env.JWT_SECRETKEY );
    var passwordDecrypt = bytes.toString(crypto.enc.Utf8);
 console.log(passwordDecrypt);
    if(password !== passwordDecrypt){
      return {
        code: 1001,
        msg: "Email hoặc mật khẩu không hợp lệ",
      };
    }

    // console.log(user);
    if (_.isNil(user)) {
      return {
        code: 1001,
        msg: "Email hoặc mật khẩu không hợp lệ",
      };
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "3 days",
    });
   

    return {
      code: 200,
      user,
      token,
    };
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
