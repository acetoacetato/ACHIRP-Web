const mongoose = require('mongoose');

// Representación de un evento (ICPRS u otros)
const EventoSchema = new mongoose.Schema({
    abreviacion: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
    },
    link: {
        type: String,
        required: true
    }   

});

module.exports = mongoose.model('Evento', EventoSchema)