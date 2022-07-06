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
