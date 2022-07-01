"use strict";
const _ = require("lodash");
const gql = require("moleculer-apollo-server").moleculerGql;
const orderContants = require("./constants/orderContants");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "miniProgram.graph",

  /**
   * Settings
   */
  settings: {
    graphql: {
      type: require("./graph/type"),
      input: require("./graph/input"),
      enum: require("./graph/enum"),
      resolvers: {
        QueryOrder: {
          getOrder: {
            action: "miniProgram.graph.getOrderInfo",
          },
          getOrders: {
            action: "miniProgram.graph.getOrders",
          },
        },
        MutationOrder: {
          createOrder: {
            action: "miniProgram.graph.createOrder",
          },
          notifyPayment: {
            action: "miniProgram.graph.notifyPayment",
          },
          pay: {
            action: "miniProgram.graph.pay",
          },
        },
      },
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
    createOrder: {
      params: {
        input: {
          $$type: "object",
          partnerTransaction: "string",
          amount: "number|positive|min:1",
          ipnUrl: "string|option",
          description: "string",
        },
      },
      // graphql: {

      // },
      handler: require("./actions/createOrder.graph.action"),
    },
    getOrders: {
      graphql: {
        query: "Order: QueryOrder",
        mutation: "Order: MutationOrder",
      },
      handler: require("./actions/getOrders.graph.action"),
    },
    notifyPayment: {
      params: {
        input: {
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
      handler: require("./actions/notifyPayment.graph.action"),
    },
    pay: {
      params: {
        input: {
          $$type: "object",
          orderId: "number",
        },
      },
      handler: require("./actions/pay.graph.action"),
    },

    getOrderInfo: {
      params: {
        body: {
          $$type: "object",
          orderId: "number",
        },
      },

      handler: require("./actions/getOrderInfo.graph.action"),
    },

    test() {
      console.log("MINIPROGRAM TEST");
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
