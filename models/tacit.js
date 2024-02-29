const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tacitSchema = Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String
  },

  content: {
    type: String
  },

  reference: {
    type: String
  },

  datePublish: {
    type: Date,
    default: new Date()
  },

  created_at: {
    type: Date
  },

  updated_at: {
    type: Date
  },

  file: {
    type: String
  },

  isVerified: { type: Boolean, default: false }
});

//models
const Tacit = mongoose.model("Tacit", tacitSchema);
module.exports = Tacit;
