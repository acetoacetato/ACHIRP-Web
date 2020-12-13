const mongoose = require('mongoose');

const CharlaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    expositor: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    lugar: {
        type: String,
        default: "1. Nada",
        required: true,
    },
    slides: {
        type: String,
        default: "1. Nada",
        required: true,
    },

});

module.exports = mongoose.model('Evento', CharlaSchema)