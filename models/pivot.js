const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pivotSchema = Schema({
  pid: { type: String },
  cid: { type: String },
});

//models
const Pivot = mongoose.model("Pivot", pivotSchema);
module.exports = Pivot;
