const mongoose = require('mongoose')

// Representación de los datos relacionados a una imagen de la galería.
const imgSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    // nombre del archivo de la imagen. Las imagenes de la galería se almacenan en /img
    imagen: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Img', imgSchema)