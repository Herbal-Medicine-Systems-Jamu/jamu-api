const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const combinationSchema = Schema({
    idrefformula: {
        type: String, 
        required: true
    },

    idcrude: {
        type: String, 
        required: true
    },

    idherbsmed:{
        type: String, 
        required: true
    },

    composition:{type: String},
    unit: {type: String},

    refCrude:{
        type: Schema.Types.ObjectId, ref: 'CrudeDrug'
    },

    refRefFormula:{
        type: Schema.Types.ObjectId, ref: 'RefFormula'
    },

    refHerbsMed:{
        type: Schema.Types.ObjectId, ref: 'HerbsMed'
    }
    
});

//models
module.exports = mongoose.model('Combination', combinationSchema);
// module.exports = plantcrude;
