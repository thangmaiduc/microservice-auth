const _ = require("lodash");
const awaitAsyncForeach = require("await-async-foreach");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../../miniProgramService/constants/orderContants");
const { customAlphabet } = require("nanoid");
const { numbers } = require("nanoid-dictionary");
const nanoId = customAlphabet(numbers, 9);
const {faker} = require("@faker-js/faker");
const faker1 = require("faker");
const bcrypt = require("bcryptjs");

module.exports = async function (ctx) {
  try {
    for (let i = 0; i < 100; i++) {
      try {
        let Date = getRandomDate();
        let intRad = Math.floor(Math.random() * 1000) + 100;
        let intRad2 = Math.floor(Math.random() * 20) + 3;
        let partnerTransaction = nanoId();
        let gender = faker1.random.arrayElement(_.values(orderContants.GENDER));
        let fullName = faker.name.findName();
        passwordHash = await bcrypt.hash("123456", 8);
        let objUser = {
          fullName,
          password: passwordHash,
          phone: faker.phone.number("+849########"),
          email: faker.internet.email(),
          avatar:'',
          gender,
          createdAt: getRandomDate(),
        };
        let order = await ctx.call("userModel.create", [objUser]);
      } catch (e) {
        console.log(e.message);
        continue;
      }
    }

    return {
      code: 200,
      mes: "ok",
    };
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate() {
  // aprox nr of days since 1970 untill 2000: 30years * 365 days
  let nr_days1 = 52 * 365;
  // aprox nr of days since 1950 untill 1970: 20years * 365 days
  let nr_days2 = 51.5 * 365;

  // milliseconds in one day
  let one_day = 1000 * 60 * 60 * 24;

  // get a random number of days passed between 1950 and 2000
  let days = getRandomInt(nr_days2, nr_days1);

  return new Date(days * one_day);
}
