const mongoose = require('mongoose')

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
    imagen: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Img', imgSchema)