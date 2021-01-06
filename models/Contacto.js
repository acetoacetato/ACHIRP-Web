const mongoose = require('mongoose');

const ContactoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Contacto', ContactoSchema)