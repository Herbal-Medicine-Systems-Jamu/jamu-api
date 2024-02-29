const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const plantSchema = Schema({
  idplant: {
    type: String,
    required: true,
    unique: true
  },

  sname: {
    type: String,
    required: true
  },

  refimg: {
    type: String
  },

  created_at: {
    type: Date
  },

  updated_at: {
    type: Date
  },

  refCrude: [{ type: Schema.Types.ObjectId, ref: "CrudeDrug" }],

  refCompound: [{ type: Schema.Types.ObjectId, ref: "Compound" }],

  refEthnic: [{ type: Schema.Types.ObjectId, ref: "Plantethnic" }],

  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

plantSchema.index(
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
const Plant = mongoose.model("Plant", plantSchema);
module.exports = Plant;
