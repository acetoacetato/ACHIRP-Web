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
    },
    inSite: {
        type: Boolean,
        required: true
    },
    // Si es in-site, esto es un textarea, en caso contrario, es un link
    cuerpo: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Noticia', noticiaSchema)