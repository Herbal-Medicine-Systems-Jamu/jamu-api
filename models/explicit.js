const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const explicitSchema = Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    firstName: {
        type: String, 
    },

    lastName: {
        type: String 
    },

    datePublish: {
        type: Date
    },

    title:{
        type: String
    },

    publisher: {type: String},
    created_at: {
        type: Date
    },

    updated_at: {
        type: Date
    },

    citation: {
        type: String
    },

    language: {
        type: String
    },

    abstract: {
        type: String
    },

    description:{
        type: String
    },

    reference:[{
        type: String
    }],

    file: {
        type: String
    }

});

//models
const Explicit = mongoose.model('Explicit', explicitSchema);
module.exports = Explicit;
