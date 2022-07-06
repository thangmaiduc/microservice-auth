"use strict";
const { customAlphabet } = require("nanoid");
const { numbers } = require("nanoid-dictionary");
const nanoId = customAlphabet(numbers, 9);
const faker = require("faker");
const _ = require("lodash");
const orderContants = require("./constants/orderContants");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "randomData",

  /**
   * Dependencies
   */
  mixins: [],
  dependencies: [],

  /**
   * Actions
   */
  actions: {
    paymentAndOrder: {
      timeout: 100000,
      rest: {
        method: "POST",
        fullPath: "/random/payment",
        auth: false,
      },
      async handler(ctx) {
        for (let i = 0; i < 30000; i++) {
          try {
            let intRad = Math.floor(Math.random() * 1000) + 100;
            let intRad2 = Math.floor(Math.random() * 200) + 3;
            let partnerTransaction = nanoId();
            let objOrder = {
              partnerTransaction,
              amount: intRad,
              ipnUrl: "",
              description: "",
              userId: intRad2,
              payMethod: faker.random.arrayElement(
                _.values(orderContants.PAYMETHOD)
              ),
              createdAt: this.getRandomDate(),
              state: faker.random.arrayElement(_.values(orderContants.STATE)),
            };
            let order = await ctx.call("orderModel.create", [objOrder]);
            let transaction = nanoId();
            let paymentObj = {
              transaction,
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
      },
    },
  },

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {
     getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
   getRandomDate() {
      // aprox nr of days since 1970 untill 2000: 30years * 365 days
      var nr_days1 = 30*365;
      // aprox nr of days since 1950 untill 1970: 20years * 365 days
      var nr_days2 = -20*365;
  
      // milliseconds in one day
      var one_day=1000*60*60*24
  
      // get a random number of days passed between 1950 and 2000
      var days = getRandomInt(nr_days2, nr_days1);
  
      return new Date(days*one_day)
  }

  },

  /**
   * Service created lifecycle event handler
   */
  created() {},

  /**
   * Service started lifecycle event handler
   */
  async started() {
    // console.log(this.broker);
  },

  /**
   * Service stopped lifecycle event handler
   */
  async stopped() {},
};
