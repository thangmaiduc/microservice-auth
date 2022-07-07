const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const _ = require("lodash");
const orderContants = require("../constants/orderContants");
const castAggregation = require("mongoose-cast-aggregation");

mongoose.plugin(castAggregation);
autoIncrement.initialize(mongoose);

const Schema = mongoose.Schema(
  {
    orderId: {
      type: Number,
      unique: true,
    },

    userId: {
      type: Number,
    },

    partnerTransaction: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
      default: 0,
    },

    ipnUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      require: true,
      default: "Tra bang vi  PAYME",
    },
    state: {
      type: String,
      enum: _.values(orderContants.STATE),
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

/*
| ==========================================================
| Plugins
| ==========================================================
*/

// Schema.plugin(autoIncrement.plugin, {
//   model: "Order",
//   field: "transaction",
//   startAt: 1,
//   incrementBy: 1,
// });
Schema.plugin(autoIncrement.plugin, {
  model: "Order",
  field: "orderId",
  startAt: 1,
  incrementBy: 1,
});

/*
| ==========================================================
| Methods
| ==========================================================
*/

/*
| ==========================================================
| HOOKS
| ==========================================================
*/

const Order = mongoose.model("Order", Schema);
module.exports = Order;
