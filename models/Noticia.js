const mongoose = require('mongoose')

const noticiaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    desc: {
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

module.exports = mongoose.model('Noticia', noticiaSchema)