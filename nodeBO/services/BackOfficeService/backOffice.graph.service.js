"use strict";
const gql = require("moleculer-apollo-server").moleculerGql;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "BackOffice.graph",

  /**
   * Dependencies
   */

  settings: {
    graphql: {
      type: require("./graph/type"),
      input: require("./graph/input"),
      enum: require("./graph/enum"),
      resolvers: {
        QueryBO: {
          exportOrderStatistics: {
            action: "BackOffice.graph.exportOrderStatistics",
          },
          exportCustomerOrders: {
            action: "BackOffice.graph.exportCustomerOrders",
          },
          orderStatistics: {
            action: "BackOffice.graph.orderStatistics",
          },

          customerOrders: {
            action: "BackOffice.graph.customerOrders",
          },
        },
      },
    },
  },
  /**
   * Actions
   */
  actions: {
    test: {
      graphql: {
        query: "BO: QueryBO",
      },
      handler(ctx) {
        return true;
      },
    },
    exportOrderStatistics: {
      auth: {
        strategies: ["Default"],
        mode: "admin",
      },
      params: {
        body: {
          $$type: "object",
          fromDate: "string",
          toDate: "string",
          method: "string|optional",
        },
      },
      handler: require("./actions/exportOrderStatistics.graph.action"),
    },
    exportCustomerOrders: {
      params: {
        body: {
          $$type: "object",
          fromDate: "string",
          toDate: "string",
          userId: "number|optional",
        },
      },
      handler: require("./actions/exportCustomerOrders.graph.action"),
    },
    orderStatistics: {
      // auth: {
      //   strategies: ["Default"],
      //   mode: "admin",
      // },
      params: {
        body: {
          $$type: "object",
          fromDate: "string",
          toDate: "string",
          method: "string|optional",
        },
      },
      handler: require("./actions/orderStatistics.graph.action"),
    },
    customerOrders: {
      params: {
        body: {
          $$type: "object",
          fromDate: "string",
          toDate: "string",
          userId: "number|optional",
        },
      },
      handler: require("./actions/customerOrders.graph.action"),
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
    isValidDate(dateString) {
      var regEx = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateString.match(regEx)) return false; // Invalid format
      var d = new Date(dateString);
      var dNum = d.getTime();
      if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
      return d.toISOString().slice(0, 10) === dateString;
    },
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
