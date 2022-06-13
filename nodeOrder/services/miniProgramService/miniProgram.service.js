"use strict";

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
        medthod: "POST",
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
    test() {
      console.log('MINIPROGRAM TEST');  
      
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
