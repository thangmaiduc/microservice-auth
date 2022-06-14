"use strict";

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
          email: "string|email",
          password: "string",
          fullName: "string",
          gender: "string",
          phone: "string",
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
    logout: {
      rest: {
        method: "POST",
        fullPath: "/auth/logout",
        auth: false,
      },

      handler: require("./actions/logout.rest.action"),
    },
    resolveToken: {
      // cache: {
      //   keys: ["token"],
      //   ttl: 60 * 60, // 1 hour
      // },
      params: {
        token: "string",
      },
      async handler(ctx) {
        const decoded = await new this.Promise((resolve, reject) => {
          jwt.verify(
            ctx.params.token,
            process.env.JWT_SECRETKEY,
            (err, decoded) => {
              if (err) return reject(err);

              resolve(decoded);
            }
          );
        });

        if (decoded.userId)
          return ctx.call("userModel.findOne", [{ _id: decoded.userId }]);
      },
    },
    userInfo: {
      rest: {
        method: "GET",
        fullPath: "/users/me",
       auth: {
          strategies: ["Default"],
          mode: "required", // 'required', 'optional', 'try'
        },
      },
      handler: require("./actions/getUserInfo.action"),
    },
    update: {
      rest: {
        method: "PATCH",
        fullPath: "/users/update/",
        auth: {
          strategies: ["Default"],
          mode: "required", // 'required', 'optional', 'try'
        },
      },
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
