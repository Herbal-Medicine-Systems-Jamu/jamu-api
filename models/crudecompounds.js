const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const compoundSchema = Schema({
  plant_species: {
    type: String
  },
  part: { type: String },
  part_of_plant: { type: String },
  effect_plant: { type: String },
  effect_part: { type: String },
  ref_metobolite: { type: String },
  refCompound: [{ type: Schema.Types.ObjectId, ref: "Compound" }],
  refPlant: { type: Schema.Types.ObjectId, ref: "Plant", default: null }
});

//models
const Compound = mongoose.model("Crudecompound", compoundSchema);
module.exports = Compound;
