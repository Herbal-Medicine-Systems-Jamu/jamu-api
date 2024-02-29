const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const tokenSchema = Schema({
    _userid: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'
    },

    token: { 
        type: String, 
        required: true 
    },

    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        expires: 43200 
    }
});

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;