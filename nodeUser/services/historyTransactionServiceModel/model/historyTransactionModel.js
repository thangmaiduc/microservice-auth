const mongoose = require("mongoose");
const _ = require("lodash");

const schema = mongoose.Schema({
  userId: {
    type:Number,
  },
  // true is add , false is minus
  action:{
    type: Boolean,
  },
  amount: {
    type: Number,
  },
  balance: {
    type: Number,
  },
  createdAt:{
    type: Date,
    default: Date.now(),
    immutable: true
  }
});

const HistoryTransaction = mongoose.model("HistoryTransaction", schema);
module.exports = HistoryTransaction;
