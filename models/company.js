const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = Schema({
    idcompany: {
        type: String, 
        required: true, 
        unique: true
    },

    cname: {
        type: String,
        required: true
    },

    address     : {type: String},
    city        : {type: String},
    country     : {type: String},
    postcode    : {type: String},
    contact     : {type: String},
    url         : {type: String}
    
});

//models
const Company = mongoose.model('Company', companySchema);
module.exports = Company;
