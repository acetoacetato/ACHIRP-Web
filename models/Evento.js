const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    link: {
        type: String,
    },
    fecha: {
        type: Date,
        required: true
    },
    desc: {
        type: String,
    },
    ubicacion: {
        type: String
    },
    expositor: {
        type: String
    },
    hora:{
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Evento', EventoSchema)