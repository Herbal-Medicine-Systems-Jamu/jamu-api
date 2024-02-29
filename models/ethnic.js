const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ethnicSchema = Schema({
    name: {
        type: String,
        unique: true 
    },

    // province: {
    //     type: String 
    // },\

    refProvince:
        {type: Schema.Types.ObjectId, ref: 'Province'},

    refPlantethnic:[
        {type: Schema.Types.ObjectId, ref: 'Plantethnic'}
    ],

});

//models
const Ethnic = mongoose.model('Ethnic', ethnicSchema);
module.exports = Ethnic;
