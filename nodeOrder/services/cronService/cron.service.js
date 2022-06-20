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
  ],

  actions: {
    checkPayment: {
      handler: require("./actions/checkPayment.action"),
    },
  },
  events: {},

  /**
   * Methods
   */
  methods: {},

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
