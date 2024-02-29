const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const herbsmedSchema = Schema({
    idherbsmed: {
        type: String, 
        required: true, 
        unique: true
    },

    idclass: {
        type: String
    },

    idcompany:{
        type: String
    },

    idtype:{
        type: String
    },

    refMedtype: {type: Schema.Types.ObjectId, ref: 'MedType', default: null},
    refDclass: {type: Schema.Types.ObjectId, ref: 'Dclass', default: null },
    refCompany:{type: Schema.Types.ObjectId, ref: 'Company', default: null},
    refCrude:[
        {type: Schema.Types.ObjectId, ref: 'CrudeDrug'}
    ],

    name: {
        type: String,
        required: true
    },

    nameloc1   : {type: String},
    nameloc2   : {type: String},
    efficacy    : {type: String},
    efficacyloc: {type: String},
    img         : {type: String},
    ref         : {type: String},
    created_at: {type: Date},
    updated_at: {type: Date},
    user_id: {type: Schema.Types.ObjectId, ref: 'User'}
});

herbsmedSchema.index({
    name: 'text',
    // description: 'text',
  }, {
    weights: {
      name: 5,
    //   description: 1,
    },
  });

//models
const HerbsMed = mongoose.model('HerbsMed', herbsmedSchema);
module.exports = HerbsMed;
