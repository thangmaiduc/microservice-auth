const _ = require("lodash");
const awaitAsyncForeach = require("await-async-foreach");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../../miniProgramService/constants/orderContants");
const { customAlphabet } = require("nanoid");
const { numbers } = require("nanoid-dictionary");
const nanoId = customAlphabet(numbers, 9);
const faker1 = require("faker");
const {faker} = require("@faker-js/faker");

module.exports = async function (ctx) {
  try {
    for (let i = 0; i < 25000; i++) {
      try {
        let Date = getRandomDate();
        let intRad = Math.floor(Math.random() * 1000) + 100;
        let intRad2 = Math.floor(Math.random() * 1000) + 3;
        let partnerTransaction = faker.random.numeric(10);
        let objOrder = {
          partnerTransaction,
          amount: intRad,
          ipnUrl: "",
          description: "",
          userId: intRad2,
          createdAt: Date,
          payMethod: faker1.random.arrayElement(
            _.values(orderContants.PAYMETHOD)
          ),
          state: faker1.random.arrayElement(_.values(orderContants.STATE)),
        };
        let order = await ctx.call("orderModel.create", [objOrder]);
        let transaction = nanoId();
        let paymentObj = {
          transaction,
          createdAt: Date,
          orderId: order.orderId,
          method: order.payMethod,
          state: order.state,
        };
        let payment = await ctx.call("paymentModel.create", [paymentObj]);
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
  let nr_days1 = 52.5*365;
  // aprox nr of days since 1950 untill 1970: 20years * 365 days
  let nr_days2 = 51.5*365;

  // milliseconds in one day
  let one_day=1000*60*60*24

  // get a random number of days passed between 1950 and 2000
  let days = getRandomInt(nr_days2, nr_days1);

  return new Date(days*one_day)
}
