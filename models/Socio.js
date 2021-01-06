const mongoose = require('mongoose');

const SocioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    institucion: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Socio', SocioSchema)