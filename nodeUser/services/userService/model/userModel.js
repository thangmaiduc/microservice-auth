const mongoose = require("mongoose");
const _ = require("lodash");
const autoIncrement = require("mongoose-auto-increment");
const userContants = require("../constants/userContants");

autoIncrement.initialize(mongoose);

const schema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  fullName: { type: String, require: true },
  password: { type: String, require: true },
  phone: { type: String },
  email: { type: String, require: true },
  avatar: { type: String, default: "" },
  gender: {
    type: String,
    enum: _.values(userContants.GENDER),
  },
});

schema.plugin(autoIncrement.plugin, {
  model: `'User'`,
  field: "id",
  startAt: 1,
  incrementBy: 1,
});


const User = mongoose.model("User", schema);
module.exports = User;
