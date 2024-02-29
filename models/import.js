const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const importSchema = Schema({
    idimport: {
        type: String, 
        required: true, 
        unique: true
    }
});


//models
const Import = mongoose.model('Import', importSchema);
module.exports = Import;
