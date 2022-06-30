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
  userId: {
    type: Number,
    require: true,
    unique: true,
  },

  otp: {
    type: String,
    require: true,
  },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
});

schema.plugin(autoIncrement.plugin, {
  model: `Otp`,
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const Otp = mongoose.model("Otp", schema);
module.exports = Otp;
