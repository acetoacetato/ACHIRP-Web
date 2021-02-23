const mongoose = require('mongoose');

// Modelo de los socios de la organización
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