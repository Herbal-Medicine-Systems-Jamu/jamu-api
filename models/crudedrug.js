const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const crudedrugSchema = Schema({
  idcrude: {
    type: String,
    required: true,
    unique: true
  },

  sname: {
    type: String
  },

  name_en: { type: String },
  name_loc1: { type: String },
  name_loc2: { type: String },
  gname: { type: String },
  position: { type: String },
  effect: { type: String },
  effect_loc: { type: String },
  comment: { type: String },
  ref: { type: String },
  refPlant: [{ type: Schema.Types.ObjectId, ref: "Plant" }],
  refHerbsMed: [{ type: Schema.Types.ObjectId, ref: "HerbsMed" }]
});

crudedrugSchema.index(
  {
    sname: "text"
    // description: 'text',
  },
  {
    weights: {
      sname: 5
      //   description: 1,
    }
  }
);

//models
const CrudeDrug = mongoose.model("CrudeDrug", crudedrugSchema);
module.exports = CrudeDrug;
