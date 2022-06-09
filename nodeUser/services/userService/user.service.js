"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const userModel = require("./model/userModel");
const MongooseAction = require("moleculer-db-adapter-mongoose-action");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "userModel",
  mixins: [DbService],
  adapter: new MongooseAdapter(process.env.MONGO_URI),
  model: userModel,
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
    ...MongooseAction(),

    userInfo: {
      rest: {
        method: "GET",
        fullPath: "/users/me",
        auth: false,
      },
      handler: require("./actions/getUserInfo.action"),
    },
    update: {
      rest: {
        method: "PATCH",
        fullPath: "/users/update/:token",
        auth: false,
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
  async started() {},

  /**
   * Service stopped lifecycle event handler
   */
  async stopped() {},
};
