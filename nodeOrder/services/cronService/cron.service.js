const Cron = require("moleculer-cron");
("use strict");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "cronJob",

  mixins: [Cron],

  crons: [
    {
      name: "checkThanhToan",
      cronTime: "0 * * * *",
      onTick: async function (ctx) {
        console.log("checkThanhToan is started");

        this.getLocalService("cronJob")
          .actions.checkPayment()
          .then((data) => {
            console.log("Oh!", data);
          });
      },
      runOnInit: function () {
        console.log("checkThanhToan is created");
      },
      // manualStart: true,
      timeZone: "America/Nipigon",
    },
    // {
    //   name: "randomData",
    //   cronTime: "* * * * *",
    //   onTick: async function (ctx) {
    //     console.log("randomData is started");

    //     this.getLocalService("cronJob")
    //       .actions.randomOrder()
    //       .then((data) => {
    //         console.log("Oh!", data);
    //       });
    //     this.getLocalService("cronJob")
    //       .actions.randomOrder()
    //       .then((data) => {
    //         console.log("Oh!", data);
    //       });
    //   },
    //   runOnInit: function () {
    //     console.log("randomData is created");
    //   },
    //   // manualStart: true,
    //   timeZone: "America/Nipigon",
    // },
    // {
    //   name: "randomuser",
    //   cronTime: "* * * * *",
    //   onTick: async function (ctx) {
    //     console.log("randomuser is started");

    //     this.getLocalService("cronJob")
    //       .actions.randomUser()
    //       .then((data) => {
    //         console.log("Oh!", data);
    //       });
       
    //   },
    //   runOnInit: function () {
    //     console.log("randomUser is created");
    //   },
    //   // manualStart: true,
    //   timeZone: "America/Nipigon",
    // },
    
  ],

  actions: {
    checkPayment: {
      handler: require("./actions/checkPayment.action"),
    },
    randomOrder: {
      timeout: 100000,
      handler: require("./actions/randomOrder.action"),
    },
    randomUser: {
      timeout: 100000,
      handler: require("./actions/randomUser.action"),
    },
  },
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
      var nr_days1 = 52 * 365;
      // aprox nr of days since 1950 untill 1970: 20years * 365 days
      var nr_days2 = 50 * 365;

      // milliseconds in one day
      var one_day = 1000 * 60 * 60 * 24;

      // get a random number of days passed between 1950 and 2000
      var days = getRandomInt(nr_days2, nr_days1);

      return new Date(days * one_day);
    },
  },

  /**
   * Service created lifecycle event handler
   */
  created() {},

  /**
   * Service started lifecycle event handler
   */
  async started() {},

  /**
   * Service stopped lifecycle event handler
   */
  async stopped() {},
};
