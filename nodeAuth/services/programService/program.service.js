"use strict";
const ApiGateway = require("moleculer-web");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "auth",

  /**
   * Dependencies
   */
  dependencies: [],

  /**
   * Actions
   */
  actions: {
    test: {
      rest: {
        method: "POST",
        fullPath: "/",
        auth: false,
      },
      handler(ctx) {
        return {
          code: 200,
          mes: "ok",
        };
      },
    },

    login: {
      rest: {
        method: "POST",
        fullPath: "/auth/login",
        auth: false,
      },
      params: {
        body: {
          $$type: "object",
          email: "string",
          password: "string",
        },
      },
      handler: require("./actions/login.rest.action"),
    },
   
    register: {
      rest: {
        method: "POST",
        fullPath: "/auth/register",
        auth: false,
      },
      params: {
        body: {
          $$type: "object",
          email: "string",
          password: "string",
          fullName: "string",
          gender: "string",
          phone: 'string'
        },
      },
      handler: require("./actions/register.rest.action"),
    },
    forgotPassword: {
      rest: {
        method: "POST",
        fullPath: "/auth/forgot-password",
        auth: false,
      },
      params: {
        body: {
          $$type: "object",
          email: "string",
         
        },
      },
      handler: require("./actions/forgotPassword.rest.action"),
    },
  },

  // add: {
  //   rest: {
  //     method: "POST",
  //     fullPath: "/auth/login",
  //     // auth: {
  //     // 	strategies: ["Default"],
  //     // 	mode: "try", // 'required', 'optional', 'try'
  //     // },
  //   },
  //   params: {
  //     body: {
  //       $$type: "object",

  //     },
  //   },
  //   handler: require("./actions/add.rest.action"),
  // },
  // edit: {
  //   rest: {
  //     method: "PUT",
  //     fullPath: "/v1/Internal/MiniProgram/:miniProgramId",
  //     // auth: {
  //     // 	strategies: ["Default"],
  //     // 	mode: "try", // 'required', 'optional', 'try'
  //     // },
  //   },
  //   params: {
  //     body: {
  //       $$type: "object",
  //     },
  //   },
  //   handler: require("./actions/edit.rest.action"),
  // },
  // },

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
