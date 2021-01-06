const mongoose = require('mongoose');

const DirectorioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    cargo: {

    },
    institucion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Directorio', DirectorioSchema)