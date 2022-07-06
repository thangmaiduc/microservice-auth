"use strict";
const _ = require("lodash");
const moleculerI18n = require("moleculer-i18n-js");
const QueueMixin = require("moleculer-rabbitmq");
const checkIsAuthenticated = require("./methods/checkIsAuthenticated");
const path = require("path");
const queueMixin = QueueMixin({
  connection: "amqp://localhost",
  asyncActions: true, // Enable auto generate .async version for actions
});

const orderContants = require("./constants/orderContants");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "miniProgram.rest",

  /**
   * Settings
   */
  mixins: [queueMixin, moleculerI18n, checkIsAuthenticated],
  i18n: {
    directory: path.join(__dirname, "locales"),
    locales: ["vi", "en"],
    defaultLocale: "vi",
  },
  hooks: {
    before: {
      // "*": ["checkIsAuthenticated"],
    },
  },
  settings: {
    amqp: {
      connection: "amqp://localhost", // You can also override setting from service setting
    },
  },

  /**
   * Dependencies
   */
  dependencies: [],

  /**
   * Actions
   */
  actions: {
    pubCreateOrder: {
      // rest: {
      //   fullPath: "/orders",
      //   method: "POST",
      //   auth: {
      //     strategies: ["Default"],
      //     mode: "required", // 'required', 'optional', 'try'
      //   },
      // },

      params: {
        body: {
          $$type: "object",
          partnerTransaction: "string",
          amount: "number|positive|min:1",
          ipnUrl: "string",
          description: "string",
        },
      },
      handler: require("./actions/pubCreateOrder.rest.action"),
    },
    conCreateOrder: {
      queue: {
        amqp: {
          queueAssert: {
            durable: false,
          },
          consume: {
            noAck: true,
          },
          prefetch: 1,
        },
      },
      rest: {
        fullPath: "/orders",
        method: "POST",
        auth: {
          strategies: ["Default"],
          mode: "required", // 'required', 'optional', 'try'
        },
      },
      params: {
        body: {
          $$type: "object",
          partnerTransaction: "string",
          amount: "number|positive|min:1",
          ipnUrl: "string",
          description: "string",
        },
      },
      handler: require("./actions/conCreateOrder.rest.action"),
    },
    conCreateOrder2: {
      // cache: {
      //   keys: ["userId"],
      // },
      timeout: 15000,
      rest: {
        fullPath: "/orders2",
        method: "POST",
        auth: {
          strategies: ["Default"],
          mode: "required", // 'required', 'optional', 'try'
        },
      },

      params: {
        body: {
          $$type: "object",
          partnerTransaction: "string",
          amount: "number|positive|min:1",
          ipnUrl: "string",
          description: "string",
        },
      },
      handler: require("./actions/conCreateOrder2.rest.action"),
    },
    updateWallet: {
      // cache: true,

      params: {
        amount: "number",
        balance: "number|positive|min:0",
        userId: "number|min:0",
      },
      handler: require("./actions/updateWallet.service.rest"),
    },
    pay: {
      rest: {
        method: "POST",
        fullPath: "/orders/pay",
        // auth: {
        //   strategies: ["Default"],
        //   mode: "required", // 'required', 'optional', 'try'
        // },
      },
      params: {
        body: {
          $$type: "object",
          orderId: "number",
        },
      },
      handler: require("./actions/pay.rest.action"),
    },
    notifyPayment: {
      rest: {
        method: "POST",
        fullPath: "/orders/notify",
        // auth: {
        //   strategies: ["Default"],
        //   mode: "required", // 'required', 'optional', 'try'
        // },
      },
      params: {
        body: {
          $$type: "object",
          transaction: "number",
          amount: "number",
          description: "string",
          state: {
            type: "string",
            enum: _.values(_.omit(orderContants.STATE, ["PENDING"])),
          },
        },
      },
      handler: require("./actions/notifyPayment.rest.action"),
    },

    getOrderInfo: {
      // hooks: {
      //   before: ["checkIsAuthenticated"],
      // },
      cache: {
        keys: ["body.orderId"],
      },
      rest: {
        method: "GET",
        fullPath: "/orders/",
        auth: {
          strategies: ["Default"],
          mode: "required", // 'required', 'optional', 'try'
        },
      },
      params: {
        body: {
          $$type: "object",
          orderId: "number",
        },
      },

      handler: require("./actions/getOrderInfo.rest.action"),
    },

    test(ctx) {
      let lang = ctx.params.lang || "vi";

      this.setLocale(lang);
      return this.__("100002");
    },
  },

  /**
   * Events
   */
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
