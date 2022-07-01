const mongoose = require("mongoose");
const _ = require("lodash");
const autoIncrement = require("mongoose-auto-increment");
const supplierResponseContants = require("../constants/supplierResponseContants");

autoIncrement.initialize(mongoose);

const schema = mongoose.Schema({
  supplierTransaction:{
    type: String,
    unique: true
  },
  transaction: {
    type: Number,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    enum: _.values(supplierResponseContants.STATE)
    
  },
  amount:{
    type: String,
  },
  id: {
    type: Number,
    require: true,
    unique: true,
  },
  response:{
    type:Object
  }

  
});

schema.plugin(autoIncrement.plugin, {
  model: `SupplierResponse`,
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const SupplierResponse = mongoose.model("SupplierResponse", schema);
module.exports = SupplierResponse;
