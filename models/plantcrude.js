const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantcrudeSchema = Schema({
    idplant: {
        type: String, 
        required: true
    },

    idcrude: {
        type: String, 
        required: true
    },

    refPlant:{
        type: Schema.Types.ObjectId, ref: 'Plant'
    },

    refCrude:{
        type: Schema.Types.ObjectId, ref: 'CrudeDrug'
    }
});

//models
module.exports = mongoose.model('PlantCrude', plantcrudeSchema);
// module.exports = plantcrude;
