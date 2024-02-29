const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantethnicSchema = Schema({
    name_ina: {type: String },
    ethnic: {type: String},
    disease_ina: {type: String },
    disease_ing: {type: String },
    species: {type: String},
    family: {type: String},
    section_ina: {type: String},
    section_ing: {type: String},
    refEthnic: {type: Schema.Types.ObjectId, ref: 'Ethnic'},
    refProvince: {type: Schema.Types.ObjectId, ref: 'Province'},
    refPlant: {type: Schema.Types.ObjectId, ref: 'Plant'},
    refCrudedrug: {type: Schema.Types.ObjectId, ref: 'CrudeDrug'}
});

//models
const Plantethnic = mongoose.model('Plantethnic', plantethnicSchema);
module.exports = Plantethnic;
