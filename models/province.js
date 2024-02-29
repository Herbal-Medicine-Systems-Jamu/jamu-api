const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const provinceSchema = Schema({
    province_id: {
        type: String,
        required: true, 
        unique: true 
    },

    province_name: {
        type: String 
    },

    province_name_abbr: {
        type: String
    },

    province_name_id:{
        type: String
    },

    province_name_en: {
        type: String
    },

    province_capital_city_id: {
        type: String
    },

    iso_code: {
        type: String
    },

    iso_name: {
        type: String
    },

    iso_type: {
        type: String
    },

    iso_geounit: {
        type: String
    },

    timezone: {
        type: String
    },

    province_lat: {
        type: String
    },

    province_lon: {
        type: String
    }

});

//models
const Province = mongoose.model('Province', provinceSchema);
module.exports = Province;
