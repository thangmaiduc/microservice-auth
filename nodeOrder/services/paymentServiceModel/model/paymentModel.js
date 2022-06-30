const mongoose = require("mongoose");
const _ = require("lodash");
const autoIncrement = require("mongoose-auto-increment");
const paymentContants = require("../constants/paymentContants");

autoIncrement.initialize(mongoose);

const schema = mongoose.Schema({
  transaction: {
    type: Number,
    required: true,
    unique: true,
  },
  orderId: {
    type: Number,
    
  },
  id: {
    type: Number,
    require: true,
    unique: true,
  },
  state:{
    type: String,
    enum: _.values(paymentContants.STATE),
    default : "PENDING"
  }

  
});

schema.plugin(autoIncrement.plugin, {
  model: `Payment`,
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const Payment = mongoose.model("Payment", schema);
module.exports = Payment;
