"use strict";
const _ = require("lodash");

const orderContants = require('./constants/orderContants');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "miniProgram",

  /**
   * Settings
   */
  settings: {},

  /**
   * Dependencies
   */
  dependencies: [],

  /**
   * Actions
   */
  actions: {
    createOrder: {
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
          amount: "number",
          ipnUrl: "string",
          description: "string",
        },
      },
      handler: require("./actions/createOrder.action"),
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
          state:{
            type: 'string',
            enum: _.values(_.omit(orderContants.STATE,['PENDING']))
          }
        },
      },
      handler: require("./actions/notifyPayment.action"),
    },

    getOrderInfo: {
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
          transaction: "number",
          
        },
      },

      handler: require("./actions/getOrderInfo.action"),
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
