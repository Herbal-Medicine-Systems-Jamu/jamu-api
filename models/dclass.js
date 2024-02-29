const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const dclassSchema = Schema({
    idclass: {
        type: String, 
        required: true, 
        unique: true
    },

    class: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    diseases:{
        type: String
    },

    ref:{
        type: String
    }
});

//models
const Dclass = mongoose.model('Dclass', dclassSchema);
module.exports = Dclass;
