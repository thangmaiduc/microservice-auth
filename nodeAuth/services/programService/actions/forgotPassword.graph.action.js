const _ = require("lodash");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { MoleculerError } = require("moleculer").Errors;
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
module.exports = async function (ctx) {
  try {
    const { email } = ctx.params.body;
    const user = await ctx.call("userModel.findOne", [{ email }]);
    if (!user) {
      return {
        successed: false,
        message: "Không thấy tài khoản của bạn",
      };
    }
    const checkOtp = await ctx.call("otpModel.findOne", [{ userId: user.id }]);
    if (_.get(checkOtp, "otp", null) != null) {
      return {
        successed: false,
        message:
          "Đã gửi email đổi mật khẩu, vui lòng xem lại email và thử lại sau",
      };
    }
    const OTP = otpGenerator.generate(6, {
      digits: true,

      specialChars: false,
    });

    const data = {
      from: "thang00lata@gmail.com",
      to: email,
      subject: "Đổi mật khẩu!!",
      html: `<h2>Mật khẩu mới của bạn là: ${OTP}</h2>`,
    };
    sgMail
      .send(data)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        try {
          console.log(error);
          return {
            code: 400,
            msg: error.message,
          };
        } catch (error) {}
      });
    console.log(OTP);
    let passwordHash = await bcrypt.hash(OTP, 8);
    await ctx.call("userModel.updateOne", [
      { email },
      { password: passwordHash },
    ]);
    await ctx.call("otpModel.create", [
      {
        userId: user.id,
        otp: passwordHash,
      },
    ]);

    return {
      message: "Mật khẩu mới đã gửi tới email của bạn",
      successed: true,
    };
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
