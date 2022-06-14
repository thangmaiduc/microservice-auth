const _ = require("lodash");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { MoleculerError } = require("moleculer").Errors;
const bcrypt= require("bcryptjs");
const otpGenerator = require("otp-generator");
module.exports = async function (ctx) {
  try {
    const { email } = ctx.params.body;
    const user =await  ctx.call("userModel.findOne", [{ email }])
    if(!user){
        return {
            code:400,
            msg: 'Không thấy tài khoản của bạn'
        }
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
    // var passwordEncrypt =await crypto.AES.encrypt(OTP, process.env.JWT_SECRETKEY).toString();
    let passwordHash = await bcrypt.hash(OTP, 8);
    await ctx.call("userModel.updateOne", [{ email }, {password: passwordHash}]);

    return{ 
        msg: "Mật khẩu mới đã gửi tới email của bạn",
        code:200
 }
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
