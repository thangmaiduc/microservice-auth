const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const jwt = require("jsonwebtoken");
// const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
  const updates = Object.keys(ctx.params.body);
  const allowsUpdate = ["fullName", "phone", "gender"];

  const isValidUpdate = updates.every((update) =>
    allowsUpdate.includes(update)
  );

  if (!isValidUpdate) return { msg: "Chỉnh sửa không hợp lệ", code: 400 };
  try {
    // const { token } = ctx.params.params;

    // console.log(token);
    // const decode = jwt.verify(token, process.env.JWT_SECRETKEY);
    // if (_.get(decode, "userId", null) == null) {
    //   return {
    //     code: 403,
    //     msg: "token hết hạn hoặc không đúng",
    //   };
    // }
    const userUpdate = {};
    for (key in ctx.params.body) {
      if (_.get(ctx.params.body, key, null) !== null) {
        userUpdate[key] = ctx.params.body[key];
      }
    }
    console.log(ctx.meta);
    const user = await ctx.call("userModel.findOneAndUpdate", [
      { id: ctx.meta.userId },
      userUpdate,
    ]);
    if(!user) return {
      code: 400,
      msg: "that bai",
    };
    else
    return {
      code: 200,
      msg: "Sửa thông tin thành công",
    };
  } catch (err) {
    console.log(err);
    return ctx.params;
  }
};
