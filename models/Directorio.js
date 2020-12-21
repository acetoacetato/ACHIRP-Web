const mongoose = require('mongoose');

const DirectorioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    institucion: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Directorio', DirectorioSchema)