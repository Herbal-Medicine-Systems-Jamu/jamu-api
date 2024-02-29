const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medtypeSchema = Schema({
    idtype: {
        type: String, 
        required: true, 
        unique: true
    },

    medname: {
        type: String,
        required: true
    }
});

//models
const MedType = mongoose.model('MedType', medtypeSchema);
module.exports = MedType;
