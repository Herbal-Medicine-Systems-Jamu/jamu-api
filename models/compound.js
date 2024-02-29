const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const compoundSchema = Schema({
  compound_id: {
    type: String
  },
  cname: { type: String },
  effect_compound: { type: String },
  pubchem_ID: { type: String },
  knapsack_ID: { type: String },
  chemspider_ID: { type: String },
  other_ID: { type: String },
  note: { type: String },
  ref_effect: { type: String },
  molecular_weight: { type: String },
  molecular_formula: { type: String },
  CAS_ID: { type: String },
  source: { type: String },
  refCrudeCompound: [
    {
      type: Schema.Types.ObjectId,
      ref: "Crudecompound",
      default: null
    }
  ],
  refPlant: [{ type: Schema.Types.ObjectId, ref: "Plant", default: null }]
});

//models
const Compound = mongoose.model("Compound", compoundSchema);
module.exports = Compound;
