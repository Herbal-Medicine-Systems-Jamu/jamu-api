const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refformulaSchema = Schema({
    idformula: {
        type: String, 
        required: true, 
        unique: true
    },

    idherbsmed: {
        type: String, 
        required: true
    },

    refHerbsmed: 
        {type: Schema.Types.ObjectId, ref: 'HerbsMed'}
    ,

    ref:{
        type: String
    }
});

//models
const RefFormula = mongoose.model('RefFormula', refformulaSchema);
module.exports = RefFormula;
