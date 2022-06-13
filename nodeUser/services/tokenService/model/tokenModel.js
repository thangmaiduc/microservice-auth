const mongoose = require("mongoose");
const _ = require("lodash");

const schema = mongoose.Schema({
  userId: {
    type:Number,
  },

  token: String,
 
  expiredAt: {
    type: Date,
  },
});

const Token = mongoose.model("Token", schema);
module.exports = Token;
