"use strict";
const gql = require("moleculer-apollo-server").moleculerGql;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "auth.graph",

  /**
   * Dependencies
   */

  settings: {
    graphql: {
      type: require("./graph/type"),
      input: require("./graph/input"),
      enum: require("./graph/enum"),
      resolvers: {
        MutationAuth: {
          login: {
            action: "auth.graph.login",
          },
          register: {
            action: "auth.graph.register",
          },
          forgotPassword: {
            action: "auth.graph.forgotPassword",
          },

          updateUser: {
            action: "auth.graph.updateUser",
          },
        },
        QueryAuth: {
          userInfo: {
            action: "auth.graph.userInfo",
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
        mutation: "Auth: MutationAuth",
        query: "Auth: QueryAuth",
      },
      handler(ctx) {
        return true;
      },
    },

    login: {
      params: {
        body: {
          $$type: "object",
          email: "string",
          password: "string",
        },
      },
      handler: require("./actions/login.graph.action"),
    },

    register: {
      params: {
        body: {
          $$type: "object",
          email: "string|email",
          password: "string",
          fullName: "string",
          gender: "string",
          phone: "string",
        },
      },
      handler: require("./actions/register.graph.action"),
    },
    forgotPassword: {
      params: {
        body: {
          $$type: "object",
          email: "string",
        },
      },
      handler: require("./actions/forgotPassword.graph.action"),
    },

    userInfo: {
      handler: require("./actions/getUserInfo.action"),
    },
    updateUser: {
      handler: require("./actions/updateUser.action"),
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
