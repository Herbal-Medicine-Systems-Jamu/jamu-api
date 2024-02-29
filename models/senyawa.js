const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const senyawaSchema = Schema({
  plant_species: {
    type: String
  },

  part: {
    type: String
  },

  part_plant: { type: String },
  cname: { type: String },
  effect_plant: { type: String },
  effect_part: { type: String },
  effect_compound: { type: String },
  reff_metabolites: { type: String },
  reff_additional: { type: String },
  refPlant: { type: Schema.Types.ObjectId, ref: "Plant", default: null },

  refCrudeCompound: {
    type: Schema.Types.ObjectId,
    ref: "Crudecompound",
    default: null
  },
  refCompound: { type: Schema.Types.ObjectId, ref: "Compound", default: null }
});

//models
const Senyawa = mongoose.model("Senyawa", senyawaSchema);
module.exports = Senyawa;
