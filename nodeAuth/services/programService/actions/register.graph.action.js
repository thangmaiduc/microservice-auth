const _ = require("lodash");

const { MoleculerError } = require("moleculer").Errors;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = async function (ctx) {
  try {
    const payload = ctx.params.body;
    const { email } = payload;
    const userCheck = await ctx.call("userModel.findOne", [{ email }]);

    if (!_.isNil(userCheck)) {
      return {
        successed: false,
        message: "Email đã đăng kí",
      };
    }
    // var hash = crypto.MD5(process.env.JWT_SECRETKEY).toString();
    // var passwordEncrypt = crypto.AES.encrypt(payload.password,process.env.JWT_SECRETKEY ).toString();

    passwordHash = await bcrypt.hash(payload.password, 8);
    payload.password = passwordHash;
    // console.log(payload);
    const user = await ctx.call("userModel.create", [payload]);
    const walletObj = {
      userId: user.id,
    };
    await ctx.call("walletModel.create", [walletObj]);
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY, {
    //   expiresIn: "3 days",
    // });

    return {
      successed: true,
      message: "Thành công",
      user,
    };
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
