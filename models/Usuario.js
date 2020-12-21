const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    passwd: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }

});

module.exports = mongoose.model('Usuario', UsuarioSchema)