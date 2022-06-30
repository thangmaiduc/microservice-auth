const mongoose = require("mongoose");
const _ = require("lodash");
const autoIncrement = require("mongoose-auto-increment");
// const userContants = require("../constants/userContants");

autoIncrement.initialize(mongoose);

const schema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  userId:{
    type: Number,
    require: true,
    unique: true
  },
  
  balance:{
    type: Number,
    default:0
  }
 
});

schema.plugin(autoIncrement.plugin, {
  model: `'Wallet'`,
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const Wallet = mongoose.model("Wallet", schema);
module.exports = Wallet;
