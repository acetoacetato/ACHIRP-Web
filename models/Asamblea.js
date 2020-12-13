const mongoose = require('mongoose');

const AsambleaSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true
    },
    inicio: {
        type: Date,
        required: true
    },
    fin: {
        type: Date,
        required: true
    },
    tabla: {
        type: String,
        default: "1. Nada",
        required: true,
    },
    Acuerdos: {
        type: String,
        default: "1. N/A"
    }
});

module.exports = mongoose.model('Asamblea', AsambleaSchema)