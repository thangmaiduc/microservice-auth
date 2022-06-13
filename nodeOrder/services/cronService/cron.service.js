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
      cronTime: "* * * * *",
      onTick: async function (ctx) {
        console.log("checkThanhToan is started");

        this.getLocalService("miniProgram")
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
    //   name: "JobHelloWorld",
    //   cronTime: "* * * * *",
    //   onTick: async function () {
    //     console.log("JobHelloWorld ticked");
    //      this.getLocalService("miniProgram")
    //       .actions.test()
    //       .then((data) => {
    //         console.log("Oh!", data);
    //       });
    //     this.getLocalService("cronJob")
    //       .actions.say()
    //       .then((data) => {
    //         console.log("Oh!", data);
    //       });
    //   },
    //   runOnInit: function () {
    //     console.log("JobHelloWorld is created");
    //   },
    //   manualStart: true,
    //   timeZone: "America/Nipigon",
    // },
    // {
    //   name: "JobWhoStartAnother",
    //   cronTime: "* * * * *",
    //   onTick: async function () {
    //     console.log("JobWhoStartAnother ticked");

    //     var job = this.getJob("JobHelloWorld");
        
    //     if (!job.lastDate()) {
    //       job.start();
    //     } else {
    //       console.log("JobHelloWorld is already started!");
    //     }
    //   },
    //   runOnInit: function () {
    //     console.log("JobWhoStartAnother is created");
    //   },
    //   timeZone: "America/Nipigon",
    // },
  ],

  actions: {
    say: {
      handler(ctx) {
        return "HelloWorld!";
      },
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
