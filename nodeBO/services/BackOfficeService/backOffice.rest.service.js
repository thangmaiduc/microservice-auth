"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "BackOffice.rest",

  /**
   * Dependencies
   */
  mixins: [],
  dependencies: [],

  /**
   * Actions
   */
  actions: {
    exportOrderStatistics: {
      rest: {
        method: "GET",
        fullPath: "/backoffice/orders/excel",
        auth: {
          strategies: ["Default"],
          mode: "admin",
        },
      },
      params: {
        body: {
          $$type: "object",
          fromDate: "string",
          toDate: "string",
          method: "string|optional",
        },
      },
      handler: require("./actions/exportOrderStatistics.rest.action"),
    },
    exportCustomerStatistics: {
      rest: {
        method: "GET",
        fullPath: "/backoffice/customer/excel",
        auth: {
          strategies: ["Default"],
          mode: "admin",
        },
      },
      params: {
        body: {
          $$type: "object",
          fromDate: "string",
          toDate: "string",
          userId: "number|optional",
        },
      },
      handler: require("./actions/exportCustomerOrders.rest.action"),
    },
    orderStatistics: {
      rest: {
        method: "GET",
        fullPath: "/backoffice/orders/",
        auth: {
          strategies: ["Default"],
          mode: "admin",
        },
      },
      params: {
        body: {
          $$type: "object",
          fromDate: "string",
          toDate: "string",
          method: "string|optional",
        },
      },
      handler: require("./actions/orderStatistics.rest.action"),
    },
    customerStatistics: {
      rest: {
        method: "GET",
        fullPath: "/backoffice/customer",
        auth: {
          strategies: ["Default"],
          mode: "admin",
        },
      },
      params: {
        body: {
          $$type: "object",
          fromDate: "string",
          toDate: "string",
          userId: "number|optional",
        },
      },
      handler: require("./actions/customerOrders.rest.action"),
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
  async started() {
    // console.log(this.broker);
  },

  /**
   * Service stopped lifecycle event handler
   */
  async stopped() {},
};
